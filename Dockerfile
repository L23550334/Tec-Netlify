# Usamos una imagen oficial de PHP con Apache (como XAMPP)
FROM php:8.2-apache

# Instalamos extensiones necesarias para MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copiamos tus archivos al servidor
COPY . /var/www/html/

# Le decimos a Render que el servidor escucha en el puerto 80
EXPOSE 80
