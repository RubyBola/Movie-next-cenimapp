const uploadProduct = async (req, res) => {
  res.json({ message: "Product uploaded" });

    console.log('Request body:', req.body);
    console.log('Headers:', req.headers);
    
    const { name, price } = req.body;
    
    if (!name || !price) {
        console.log('Missing fields - name:', name, 'price:', price);
        return res.status(400).json({ 
            message: "Name and price are required" 
        });
    }
  
};
module.exports = { uploadProduct };