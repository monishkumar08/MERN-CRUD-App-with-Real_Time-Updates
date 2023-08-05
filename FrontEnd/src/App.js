import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItemId) {
        await handleEdit(selectedItemId);
        setSelectedItemId(null);
      } else {
        const response = await axios.post('http://localhost:5000/api/items', formData);
        setItems([...items, response.data]);
      }
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
  };

  const handleEdit = async (id) => {
    const itemToUpdate = items.find((item) => item._id === id);
  
    if (!itemToUpdate) {
      console.error('Item not found');
      return;
    }
  
    try {
      const updatedData = {
        name: formData.name || itemToUpdate.name,
        description: formData.description || itemToUpdate.description,
      };
  
      await axios.put(`http://localhost:5000/api/items/${id}`, updatedData);
      const updatedItems = items.map((item) =>
        item._id === id ? { ...item, ...updatedData } : item
      );
      setItems(updatedItems);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      const updatedItems = items.filter((item) => item._id !== id);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = (id) => {
    setSelectedItemId(id);
    const itemToUpdate = items.find((item) => item._id === id);
    setFormData({ name: itemToUpdate.name, description: itemToUpdate.description });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
        <div className="max-w-xl w-full space-y-10 p-10 bg-white rounded-lg shadow-lg border-2 border-black cursor-not-allowed focus:cursor-auto">
          <h1 className="text-4xl font-extrabold text-center text-purple-600 mb-8">
            MERN CRUD App
          </h1>
          <form onSubmit={handleSubmit} className="space-y-7 ">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Item name"
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Item description"
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
            />
            <button
              type="submit"
              className="w-full py-4 px-6 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200 ease-in-out"
            >
              {selectedItemId ? "Update Item" : "Add Item"}
            </button>
          </form>
          <div className="h-40 overflow-y-auto ">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="p-4 border border-gray-300 rounded flex items-center justify-between hover:bg-purple-50"
                >
                  <div>
                    <p className="font-bold text-purple-600">
                      <span className='underline'>Name:</span>  {item.name} </p>
                    <p className="text-blue-600 font-bold">
                    <span className='underline '>Description:</span> {item.description}</p>
                  </div>
                  <div className="space-x-4 flex">
  <button
    onClick={() => handleDelete(item._id)}
    className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 ease-in-out"
  >
    Delete
  </button>
  <button
    onClick={() => handleUpdate(item._id)}
    className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 ease-in-out "
  >
    Update
  </button>
</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
