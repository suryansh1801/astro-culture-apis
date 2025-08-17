Document Link : https://suryanshsahu1801.notion.site/Pie-Pay-Assignment-Document-2359e56e264a805599c2ef67b95592ce

To complete the setup and run the application, follow these steps carefully:

1. **Clone the Repository:** Download or clone the project : https://github.com/suryansh1801/pie-pay code onto your local machine by using the following command.
    
    ```jsx
    git clone https://github.com/suryansh1801/pie-pay.git
    ```
    
2. **Change directory to pie-pay :** Run the following command 
    
    ```jsx
    cd pie-pay
    ```
    
3. **Install Dependencies:** Run the following command in the project root to install all required Node.js packages:
    
    ```jsx
    npm install
    ```
    
4. **Set Up Environment Variables** file in the project root if needed (for database URLs, secrets, etc.). **`Create a .env in the project root with the following variables.`**
    
    ```jsx
    MONGO_URI=mongodb://localhost:27017/pie-pay
    PORT=3000
    ```
    
5. **Start MongoDB:** with the correct remote connection string. Make sure you have MongoDB installed and running locally or update your .env with the correct remote connection string.
6. **Run the Server:**Start the Express server with:
    
    ```jsx
    npm run dev
    ```
    
7. **Test the Endpoints:** and  endpoints.
    
    Use Postman or similar tools to test the following curls : 
    
    1. POST  :  /offer
    
    ```jsx
    curl --location 'http://localhost:3000/api/v1/offer' \
    --header 'Content-Type: application/json' \
    --data '[
        {
            "adjustment_type": "CASHBACK_ON_CARD",
            "adjustment_id": "FPO250619134128USHPF",
            "summary": "5% cashback on Flipkart Axis Bank Credit Card upto ₹4,000 per statement quarter",
            "contributors": {
                "payment_instrument": [
                    "CREDIT"
                ],
                "banks": [
                    "FLIPKARTAXISBANK"
                ],
                "emi_months": [
                    "0"
                ],
                "card_networks": []
            },
            "display_tags": [
                "PAYMENT_OPTIONS"
            ],
            "image": "https://img1a.flixcart.com/www/linchpin/fk-cp-pay/axis-78501b36.svg"
        }
    ]'
    ```
    
    2. GET : /highest-discount

    ```jsx
    curl --location 'http://localhost:3000/api/v1/highest-discount?amountToPay=50000&paymentInstrument=CREDIT&bankName=FLIPKARTAXISBANK'
    ```



