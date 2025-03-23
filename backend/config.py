import os

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://admin:12345678%40mineth@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
