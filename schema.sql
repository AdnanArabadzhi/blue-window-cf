DROP TABLE IF EXISTS Todo;
CREATE TABLE IF NOT EXISTS Todo (id UUID PRIMARY KEY, "name" TEXT, completed BOOL);
INSERT INTO Todo (id, "name", completed) VALUES ('05d5c6ad-32c7-4087-bb5a-7edad881a68d', 'Morning operative meeting', FALSE), 
('a42ca629-77c2-42e4-b28a-c27db086f7da', 'Meeting with potential clients', TRUE),
 ('8e0964df-d641-4548-abe8-0ee57ccbf1cd', 'Production release', FALSE),
  ('d903de7b-630f-48eb-991e-e8d5b4c334dd', 'Testing', FALSE);