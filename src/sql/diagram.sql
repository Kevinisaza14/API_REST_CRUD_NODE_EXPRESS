drop database if exists ecommerce;
create database ecommerce CHARACTER SET utf8mb4;
use ecommerce;
set global event_scheduler = on;
SET time_zone = "+01:00";

-- Tabla que almacena información de los usuarios
CREATE TABLE Users (
    userID VARCHAR(100) PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    userName VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLogin TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE xarxa (
    id int primary key auto_increment,
    name varchar(300) not null,
    url varchar(300) not null
);
CREATE TABLE empresas (
    id int primary key auto_increment,
    url varchar(300) not null
);
-- Tabla que almacena los logs de cambios realizados en los usuarios
CREATE TABLE UserLogs (
    logID VARCHAR(255) PRIMARY KEY,
    userID VARCHAR(100) NOT NULL,
    userAction VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    changedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tabla que almacena los tokens de login de los usuarios
CREATE TABLE UserTokens (
    tokenID VARCHAR(255) PRIMARY KEY,
    userID VARCHAR(100) NOT NULL,
    token VARCHAR(510) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiresAt TIME not NULL
);

-- Tabla que almacena las direcciones de los usuarios
CREATE TABLE Addresses (
    addressID INT PRIMARY KEY AUTO_INCREMENT,
    userID VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zipCode CHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- Tabla que almacena información de los productos
CREATE TABLE Products (
    productID INT PRIMARY KEY AUTO_INCREMENT,
    productName VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    stock INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla que almacena los ítems dentro de los carritos de compras
CREATE TABLE ShoppingCart (
    cartItemID INT PRIMARY KEY AUTO_INCREMENT,
    userID VARCHAR(255) NOT NULL,
    productID INT NOT NULL,
    quantity INT NOT NULL,
    expiresAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Tabla que almacena los pedidos realizados por los usuarios
CREATE TABLE Orders (
    orderID INT PRIMARY KEY AUTO_INCREMENT,
    userID VARCHAR(255) NOT NULL,
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    totalAmount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- Tabla que almacena los ítems dentro de los pedidos
CREATE TABLE OrderItems (
    orderItemID INT PRIMARY KEY AUTO_INCREMENT,
    orderID INT NOT NULL,
    productID INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);
-- Tabla que almacena información de los usuarios eliminados
CREATE TABLE DeletedUsers (
    userID VARCHAR(200) PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    userName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para mover los usuarios eliminados a la tabla DeletedUsers
drop trigger if exists after_delete_user;
delimiter //
create trigger after_delete_user 
before delete on Users
FOR EACH ROW
BEGIN
    IF OLD.role = "admin" THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar un usuario administrador';
    END IF;
    INSERT INTO DeletedUsers (userID, firstName, lastName, userName, email, role)
    VALUES (OLD.userID, OLD.firstName, OLD.lastName, OLD.userName, OLD.email, OLD.role);
END //
delimiter ;

-- Evento que elimina el contenido de la tabla UserTokens cada 24 horas
drop event if exists delete_expired_tokens;
delimiter //
CREATE EVENT IF NOT EXISTS delete_expired_tokens
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    DELETE FROM UserTokens WHERE expiresAt < CURRENT_TIME;
END //
delimiter ;

drop event if exists delete_expired_ShoppingCart;
delimiter //
CREATE EVENT IF NOT EXISTS delete_expired_ShoppingCart
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    DELETE FROM ShoppingCart WHERE expiresAt < CURRENT_TIME;
END //
delimiter ;


insert into Users values ('5fe6f641-2b31-4d9e-bbb2-669663eeaeea', 'super', 'admin', 'superadmin', 'superadmin@example.com', 'U2FsdGVkX19TQD7UwZylSUQ0VIrv8SLe0Dw54C9doQM=', 'admin', default, default); 

select * from users;
select * from products;
select * from UserTokens;
select us.email, us.role, u.* from UserTokens u join users us on u.userid = us.userid;
select * from xarxa;
select * from empresas;
ALTER TABLE empresas 
ADD COLUMN localidad VARCHAR(255) NULL, 
ADD COLUMN nameCompany VARCHAR(255) NULL, 
ADD COLUMN direccion VARCHAR(255) NOT NULL, 
ADD COLUMN telefono VARCHAR(255) NULL, 
ADD COLUMN email VARCHAR(255) NULL, 
ADD COLUMN web VARCHAR(255) NULL,
ADD COLUMN Estado_Empresa VARCHAR(255) not NULL default 'Activa',

-- drop table if exists empresas; 