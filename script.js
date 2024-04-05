document.addEventListener('DOMContentLoaded', function () {
    const inventoryList = document.getElementById('inventory-list');
    const addItemForm = document.getElementById('add-item-form');

    // Fetch inventory items from the server
    fetchInventory();

    addItemForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('item-name').value;
        const quantity = document.getElementById('item-quantity').value;
        const price = document.getElementById('item-price').value;

        // Add item to the inventory
        addItem({ name, quantity, price });
    });

    function fetchInventory() {
        fetch('/api/inventory')
            .then(response => response.json())
            .then(data => {
                renderInventory(data);
            })
            .catch(error => console.error('Error fetching inventory:', error));
    }

    function renderInventory(items) {
        inventoryList.innerHTML = '';
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${item.name} - Quantity: ${item.quantity} - Price: $${item.price}`;
            inventoryList.appendChild(itemElement);
        });
    }

    function addItem(item) {
        fetch('/api/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(response => response.json())
            .then(data => {
                fetchInventory();
                addItemForm.reset();
            })
            .catch(error => console.error('Error adding item:', error));
    }
});
