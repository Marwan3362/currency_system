-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: exchange_system
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `company_email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `owner_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `companies_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'شركة ','compa1s1ny@example.com','0101234512ass112678','القاهرة،11 مصر',1,3,'2025-04-22 10:08:33','2025-04-22 10:08:33'),(12,'شركة sasa','compasda1sdsa1ny@example.com','0101234asd512ass1asd12678','القاهرة،asd11 asdمصر',1,16,'2025-04-22 10:29:51','2025-04-22 10:29:51'),(13,'شركة adsasdsasa','cdasompasda1sdsa1ny@example.com','0101234asdasd512ass1asd12678','القاهرة،aasdsd11 asdمصر',1,17,'2025-04-22 10:32:02','2025-04-22 10:32:02'),(14,'شركة adsasassasasasa','cdasasaompasda1sasdsa1ny@example.com','0101234asdasd512ass1saasd12678','القاهرة،aasdssad11 asdمصر',1,19,'2025-04-22 10:40:06','2025-04-22 10:40:06'),(15,'شركة adsasasshasasasa','cdasasaomsapasda1sasdsa1ny@example.com','0101234asdasd512asass1saasd12678','القاهرة،aasdssasad11 asdمصر',1,20,'2025-04-22 10:45:28','2025-04-22 10:45:28'),(16,'شركة adsasasshasasasasa','cdasasaomsapasdadas1sasdsa1ny@example.com','0101234asdasd512asdasasdass1saasd12678','القاهرة،aasdssasdaad11 asdمصر',1,22,'2025-04-22 11:11:15','2025-04-22 11:11:15'),(17,'شركة adsasasshaasdsasasasa','cdasaasdsaomsapasdadas1sasdsa1ny@example.com','0101234asdasasdd512asdasasdass1saasd12678','القاهرة،aadassdssasdaad11 asdمصر',1,23,'2025-04-22 11:17:08','2025-04-22 11:17:08');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','Full access'),(2,'User','Limited access'),(3,'Store Owner/Manager','Manages store operations'),(4,'Financial Manager','Handles financial transactions and reporting'),(5,'Operations Manager','Oversees daily business operations'),(6,'Teller','Processes customer transactions'),(7,'Compliance Officer','Ensures regulatory compliance'),(8,'Customer (Retail & Business)','End users of the platform'),(9,'IT Administrator','Manages system infrastructure and security');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `role_id` int NOT NULL DEFAULT '2',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Marw11aasn Hassan','mar11wassan@example.com','S11troasngPassword123',NULL,NULL,1,2,'2025-04-22 10:08:33','2025-04-22 10:08:33'),(10,'ali Hassannss','hasasasasan@gmaill.com','$2b$10$IRpUuPsODs3CyTq7kwipbe4r475GTo2ghM8MbDct./3UTQusOq3r.','123456787aasasasa13s11',NULL,1,1,'2025-04-22 10:27:24','2025-04-22 10:27:24'),(16,'Marasdw11aasdasn Hassan','mar11wasdassan@example.com','S11asddasasdtroasngPassword123',NULL,NULL,1,2,'2025-04-22 10:29:51','2025-04-22 10:29:51'),(17,'Marasdwasd11aasdasn Hassan','mar11wasdasdassan@example.com','$2b$10$m8dprDCeuQH47jafR6F.DutBBd6vY8sUDuiqqi7EEDBYVecwtZOdu',NULL,NULL,1,2,'2025-04-22 10:32:02','2025-04-22 10:32:02'),(19,'Marasdwasasasd11aasdasn Hassan','mar11wasasdasdassan@example.com','$2b$10$nslQuWWRlhIYw4jkpycG9ONW9L3GSHgqJvbKiMTJF0A1lWnNzwVjW',NULL,NULL,1,2,'2025-04-22 10:40:06','2025-04-22 10:40:06'),(20,'Marasdwasasasasd11aasdasn Hassan','mar11wasasdsaasdassan@example.com','$2b$10$80DFFrb/yw/5RqAToEOGLuEk.3x/9R8qHV.ak87rrwckiiKDQHudG',NULL,NULL,1,2,'2025-04-22 10:45:28','2025-04-22 10:45:28'),(22,'Marasdwasasasdasasd11aasdasn Hassan','mar11wasasddassaasdassan@example.com','$2b$10$e4RaAQSj0TCbOfChfciycezkP8k7BAHUbKGlWj.uJZ7ihoqeQclyW',NULL,NULL,1,2,'2025-04-22 11:11:15','2025-04-22 11:11:15'),(23,'Marasdwasdasasasdasasd11aasdasn Hassan','mar11wdsaasasddassaasdassan@example.com','$2b$10$GXDxe0Nkbppvd0.g6KOyEOB//3YwoWJ.Bg0ceUMEeunIheYjUcAxq',NULL,NULL,1,3,'2025-04-22 11:17:08','2025-04-22 11:17:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22 11:28:55
