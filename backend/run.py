from app import create_app
import os

#Membuat Flask App instance
app = create_app()

if __name__ == '__main__':

    #Dapatkan port dari environment variabel atau gunakan nilai default 5000
    port = int(os.environ.get('PORT', 5000))
    
    #Jalankan app dalam mode debug untuk pengembangan
    app.run(
        host='0.0.0.0',
        port=port,
        debug=True
    )