# TripLog
---

### Stack
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
![Axios](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)


## Develop:

### Prerequisites:
Please install required packages below:
- [uv](https://docs.astral.sh/uv/)
- [Npm](https://nodejs.org/en)
- [Ruff VScode ext](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff)
- [Python ^3.12](https://www.python.org/)

Then copy and rename `.env.example` in `backend/.env.example` to `.env`.

Change database settings in `backend` folder below:
```shell
#############################################
# Database
#############################################
DB_ENGINE=django.db.backends.mysql
DB_NAME=YOUR_DB_NAME
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASS
DB_HOST=localhost
DB_PORT=3306
```

Change django security variables:
```shell
#############################################
# Security
#############################################
DJANGO_SECRET_KEY=YOUR_DJANGO_SECRET_KEY
```

After all done, run migrate command:

```shell
uv run manage.py migrate
```

Create django super user using command below:
```shell
uv run manage.py createsuperuser
```

Then run your django app:
```shell
uv run manage.py runserver
```

Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to see API documentations.

---

### Frontend:
Go to frontend folder (`./frontend`) and install frontend requirements using npm:
```shell
npm install
```

Copy and rename `.env.example` to `.env` then change your settings below:
```shell
VITE_APP_NAME=APP_NAME
VITE_BASE_URL=BASE_URL
VITE_BASE_API_URL=BASE_API_URL
VITE_DEMO_ACCOUNT_USERNAME=YOUR_DJANGO_DEMO_ACCOUNT_USERNAME
VITE_DEMO_ACCOUNT_PASSWORD=YOUR_DJANGO_DEMO_ACCOUNT_PASSWORD
```

Run your app:
```shell
npm run dev
```
