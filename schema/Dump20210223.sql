CREATE DATABASE  IF NOT EXISTS `salamantex` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `salamantex`;
-- MySQL dump 10.13  Distrib 5.7.32, for Linux (x86_64)
--
-- Host: localhost    Database: salamantex
-- ------------------------------------------------------
-- Server version	5.7.32-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Transaction`
--

DROP TABLE IF EXISTS `Transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Transaction` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Amount` decimal(5,2) unsigned NOT NULL,
  `Currency` varchar(10) NOT NULL,
  `Source` int(10) unsigned NOT NULL,
  `Target` int(10) unsigned NOT NULL,
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Processed` datetime DEFAULT NULL,
  `State` varchar(10) NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (`Id`),
  KEY `UserId` (`Source`),
  KEY `Created` (`Created`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(512) NOT NULL,
  `Description` varchar(1000) NOT NULL DEFAULT 'No description',
  `Email` varchar(1000) NOT NULL,
  `BitcoinWallet` varchar(40) DEFAULT NULL,
  `BitcoinBalance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `EthereumWallet` varchar(40) DEFAULT NULL,
  `EthereumBalance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `MaxAmount` smallint(6) unsigned NOT NULL DEFAULT '1000',
  `ApiKey` varchar(45) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `E-Mail_UNIQUE` (`Email`),
  UNIQUE KEY `BitcoinWallet_UNIQUE` (`BitcoinWallet`),
  UNIQUE KEY `EthereumWallet_UNIQUE` (`EthereumWallet`),
  KEY `ApiKey` (`ApiKey`),
  KEY `Login` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-23 12:12:21
