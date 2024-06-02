import { Hono } from "hono";
import { cors } from 'hono/cors'

type Bindings = {
	DB: D1Database;
}
  
const app = new Hono<{Bindings: Bindings}>();

app.use('*', cors({
    origin: 'http://localhost:4200'
}))


app.get("/", async (ctx) => {
	try {
		const todos = await ctx.env.DB.prepare("SELECT * FROM Todo").all();
		const processedData = todos.results.map(item => ({
			...item,
			completed: item.completed === 1
		  }));
	
		return ctx.json({
		  todos: processedData
		});
	  } catch (error) {
		console.error('Error fetching todos:', error);
		return ctx.json({
		  error: 'Failed to fetch todos'
		}, 500);
	  }
});

  
app.post("/complete", async (ctx) => {
	console.log(ctx);
	try {        
		const bodyText = await ctx.req.raw.text();
		const body = JSON.parse(bodyText);
		const { id } = body;
		await ctx.env.DB.prepare("UPDATE Todo SET completed = ? WHERE id = ?").bind(true, id).run();

		return ctx.json({
			message: 'Todo created successfully',
		}, 201);
	} catch (error) {
		console.error('Error creating todo:', error);
		return ctx.json({
			error: 'Failed to create todo'
		}, 500);
	}
});
  
app.put("/new", async (ctx) => {
	try {
		const bodyText = await ctx.req.raw.text();
		const body = JSON.parse(bodyText);
		console.log(body);
		const {name} =	body;
		const id = generateUUID();
		if (!name || name.length == 0) {
			return ctx.json({
			error: 'Name is required'
		}, 400);
	  }
  
	await ctx.env.DB.prepare("INSERT INTO Todo (completed, name, id) VALUES (FALSE, ?, ?)").bind(name, id).run();

	const res = await ctx.env.DB.prepare("SELECT * FROM Todo WHERE id = ?").bind(id).run();
	const todo = res.results[0]

	return ctx.json({
		todo: todo
	}, 201);
	} catch (error) {
		console.error('Error creating todo:', error);
		return ctx.json({
			error: error
		}, 500);
	}
});


app.delete("/:id", async (ctx) => {
	try {
        const id = ctx.req.param("id");;
		await ctx.env.DB.prepare("DELETE FROM Todo WHERE id = ?").bind(id).run();

		return ctx.json({
			message: 'Todo deleted successfully',
		}, 201);
	} catch (error) {
		console.error('Error deleting todo:', error);
		return ctx.json({
			error: error
		}, 500);
	}
});


function generateUUID() {
	const { v4: uuidv4 } = require('uuid');
	return uuidv4();
}
export default app;