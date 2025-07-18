-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 02 juil. 2025 à 17:26
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `resto_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `campagnes`
--

CREATE TABLE `campagnes` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `budget` double NOT NULL,
  `spent` double NOT NULL,
  `impressions` int(11) NOT NULL,
  `clicks` int(11) NOT NULL,
  `conversions` int(11) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `targetAudience` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `campagnes`
--

INSERT INTO `campagnes` (`id`, `name`, `type`, `status`, `budget`, `spent`, `impressions`, `clicks`, `conversions`, `startDate`, `endDate`, `targetAudience`, `createdAt`, `updatedAt`, `userId`) VALUES
('16bdae23-fd78-4d86-99ae-36dabea6e423', 'Compagne 1', 'Quick Meal Platform', 'Active', 200, 0, 0, 0, 0, '2025-07-02 00:00:00.000', '2025-08-10 00:00:00.000', 'Casablanca', '2025-06-30 11:30:29.208', '2025-06-30 11:37:13.807', 'cmc93trv70000v4t0793rjzn5'),
('b261dd5d-1f3d-4bc8-ad8b-670ad1ccb011', 'Compagne 2', 'Whatsapp Business', 'Active', 200, 0, 0, 0, 0, '2025-06-30 00:00:00.000', '2025-07-04 00:00:00.000', 'Casablanca', '2025-06-30 11:43:51.615', '2025-06-30 11:43:55.006', 'cmc93trv70000v4t0793rjzn5');

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `image`, `isActive`, `createdAt`, `updatedAt`) VALUES
('fe665309-4ed6-11f0-9802-1c394712cdca', 'Entrées', 'Les petites entrées froides ou chaudes', NULL, 1, '2025-06-21 20:35:55.023', '2025-06-23 14:33:43.000'),
('fe666980-4ed6-11f0-9802-1c394712cdca', 'Plats principaux', 'Les plats principaux du menu', NULL, 1, '2025-06-21 20:35:55.023', '2025-06-23 14:33:43.000'),
('fe666b2d-4ed6-11f0-9802-1c394712cdca', 'Desserts', 'Les douceurs de fin de repas', NULL, 1, '2025-06-21 20:35:55.023', '2025-06-23 14:33:43.000'),
('fe666b81-4ed6-11f0-9802-1c394712cdca', 'Boissons', 'Les boissons disponibles', NULL, 1, '2025-06-21 20:35:55.023', '2025-06-23 14:33:43.000');

-- --------------------------------------------------------

--
-- Structure de la table `customers`
--

CREATE TABLE `customers` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `customers`
--

INSERT INTO `customers` (`id`, `email`, `name`, `phone`, `address`, `city`, `createdAt`, `updatedAt`, `userId`) VALUES
('cus_abc123', 'client@example.com', 'Client Test', '+212600000000', '123 Rue Mohammed V', 'Casablanca', '2025-06-30 15:40:58.000', '2025-06-30 15:40:58.000', 'cmc6n7zpg0002v4zwvdbu5hpv');

-- --------------------------------------------------------

--
-- Structure de la table `dishes`
--

CREATE TABLE `dishes` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `price` double NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `isAvailable` tinyint(1) NOT NULL DEFAULT 1,
  `preparationTime` int(11) DEFAULT NULL,
  `ingredients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ingredients`)),
  `allergens` varchar(191) DEFAULT NULL,
  `calories` int(11) DEFAULT NULL,
  `isVegetarian` tinyint(1) NOT NULL DEFAULT 0,
  `isVegan` tinyint(1) NOT NULL DEFAULT 0,
  `isGlutenFree` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `categoryId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `dishes`
--

INSERT INTO `dishes` (`id`, `name`, `description`, `price`, `image`, `isAvailable`, `preparationTime`, `ingredients`, `allergens`, `calories`, `isVegetarian`, `isVegan`, `isGlutenFree`, `createdAt`, `categoryId`, `userId`, `updatedAt`) VALUES
('cmc97pa2u0001v448cmfzrt7g', 'Tajine', 'JDJEJFJ', 128, NULL, 1, 18, '\"POP\"', NULL, NULL, 0, 0, 0, '2025-06-23 14:48:50.465', 'fe665309-4ed6-11f0-9802-1c394712cdca', 'cmc93trv70000v4t0793rjzn5', '2025-06-23 14:49:10.705'),
('cmcjbifxw0000v4l4vjf9420b', 'Tajineec', 'kcdkkcd', 128, NULL, 1, 18, '[\"POP\"]', NULL, NULL, 0, 0, 0, '2025-06-30 16:33:11.731', 'fe665309-4ed6-11f0-9802-1c394712cdca', 'cmc93trv70000v4t0793rjzn5', '2025-06-30 16:33:11.731'),
('cmcjc0sjd0001v4l4w6hqmt70', 'Tajineec', 'skjckjdkc', 128, NULL, 1, 18, '[\"POP\"]', NULL, NULL, 0, 0, 0, '2025-06-30 16:47:27.865', 'fe665309-4ed6-11f0-9802-1c394712cdca', 'cmc93trv70000v4t0793rjzn5', '2025-06-30 16:47:27.865'),
('cmcjc4s7s0002v4l4l9vfpkr2', 'Tajineec', 'kcdkdc', 128, NULL, 1, 18, '[\"POP\"]', NULL, NULL, 0, 0, 0, '2025-06-30 16:50:34.072', 'fe666980-4ed6-11f0-9802-1c394712cdca', 'cmc93trv70000v4t0793rjzn5', '2025-06-30 16:50:34.072'),
('cmcjc5vo90003v4l4c2ile1qd', 'Tajineec', 'xlkdkdk', 128, NULL, 1, 18, '[\"POP\"]', NULL, NULL, 0, 0, 0, '2025-06-30 16:51:25.209', 'fe665309-4ed6-11f0-9802-1c394712cdca', 'cmc93trv70000v4t0793rjzn5', '2025-06-30 16:51:25.209'),
('cmcm1mxz80000v4q0xi1au83h', 'Tajineooo', 'ckdckdkc', 122, NULL, 1, 18, '\"POP\"', NULL, NULL, 0, 0, 0, '2025-07-02 14:20:04.059', 'fe665309-4ed6-11f0-9802-1c394712cdca', 'cmckp8tkl0000v4bszigaelx0', '2025-07-02 14:20:23.399');

-- --------------------------------------------------------

--
-- Structure de la table `legaldocuments`
--

CREATE TABLE `legaldocuments` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `file` varchar(191) DEFAULT NULL,
  `rejectionReason` varchar(191) DEFAULT NULL,
  `uploadDate` datetime(3) DEFAULT NULL,
  `expiryDate` datetime(3) DEFAULT NULL,
  `required` tinyint(1) NOT NULL DEFAULT 0,
  `userId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `menu_settings`
--

CREATE TABLE `menu_settings` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `subtitle` varchar(191) DEFAULT NULL,
  `description` varchar(191) DEFAULT NULL,
  `showPrices` tinyint(1) NOT NULL DEFAULT 1,
  `showDescriptions` tinyint(1) NOT NULL DEFAULT 1,
  `showImages` tinyint(1) NOT NULL DEFAULT 0,
  `colorTheme` varchar(191) NOT NULL DEFAULT 'droovo',
  `layout` varchar(191) NOT NULL DEFAULT 'classic',
  `language` varchar(191) NOT NULL DEFAULT 'fr',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `menu_settings`
--

INSERT INTO `menu_settings` (`id`, `title`, `subtitle`, `description`, `showPrices`, `showDescriptions`, `showImages`, `colorTheme`, `layout`, `language`, `createdAt`, `updatedAt`) VALUES
('cmckeis0x0000v4ecegg9obvp', 'Menu', 'cdjc', 'xjsjxjs', 1, 1, 0, 'modern', 'elegant', 'ar', '2025-07-01 10:45:12.415', '2025-07-01 11:06:49.460');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(191) NOT NULL,
  `orderNumber` varchar(191) NOT NULL,
  `status` enum('PENDING','CONFIRMED','PREPARING','READY','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `totalAmount` decimal(10,2) NOT NULL,
  `deliveryFee` decimal(10,2) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `deliveryAddress` varchar(191) DEFAULT NULL,
  `deliveryTime` datetime(3) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `paymentMethod` enum('CASH','CARD','PAYPAL','STRIPE','BANK_TRANSFER') DEFAULT NULL,
  `paymentStatus` enum('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `customerId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `orderNumber`, `status`, `totalAmount`, `deliveryFee`, `tax`, `discount`, `deliveryAddress`, `deliveryTime`, `notes`, `paymentMethod`, `paymentStatus`, `createdAt`, `updatedAt`, `customerId`, `userId`) VALUES
('ord_abc123', 'CMD-20250630-001', 'DELIVERED', 299.99, 20.00, 19.99, 0.00, '456 Rue Zerktouni, Casablanca', '2025-06-30 15:43:57.000', 'Livraison en soirée', 'CASH', 'PENDING', '2025-06-30 15:43:57.000', '2025-07-01 11:36:11.386', 'cus_abc123', 'cmc93trv70000v4t0793rjzn5');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `notes` varchar(191) DEFAULT NULL,
  `orderId` varchar(191) NOT NULL,
  `dishId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `payments`
--

CREATE TABLE `payments` (
  `id` varchar(191) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('CASH','CARD','PAYPAL','STRIPE','BANK_TRANSFER') NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `transactionId` varchar(191) DEFAULT NULL,
  `gatewayResponse` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `payments`
--

INSERT INTO `payments` (`id`, `amount`, `method`, `status`, `transactionId`, `gatewayResponse`, `createdAt`, `updatedAt`, `orderId`, `userId`) VALUES
('ckxyz1234567890abcdef', 150.75, 'CARD', 'COMPLETED', 'tx_ABC123456789', 'Payment processed successfully', '2025-07-01 13:57:15.000', '2025-07-01 13:04:41.525', 'ord_abc123', 'cmc93trv70000v4t0793rjzn5');

-- --------------------------------------------------------

--
-- Structure de la table `promotions`
--

CREATE TABLE `promotions` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('PERCENTAGE','FIXED_AMOUNT','FREE_DELIVERY') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `code` varchar(191) DEFAULT NULL,
  `minAmount` decimal(10,2) DEFAULT NULL,
  `maxDiscount` decimal(10,2) DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usageCount` int(11) NOT NULL DEFAULT 0,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `promotions`
--

INSERT INTO `promotions` (`id`, `name`, `description`, `type`, `value`, `code`, `minAmount`, `maxDiscount`, `usageLimit`, `usageCount`, `startDate`, `endDate`, `isActive`, `createdAt`, `updatedAt`, `userId`) VALUES
('cmcenppjg000gv47c34z6i6ve', 'Promo 1', 'KDCKD', 'FREE_DELIVERY', 20.00, 'CKDK', 100.00, 299.00, 20, 0, '2025-07-04 00:00:00.000', '2025-07-06 00:00:00.000', 1, '2025-06-27 10:15:55.275', '2025-06-27 10:47:48.204', 'cmce3asp90000v47cdjuectl2'),
('cmckq1wmh0002v4bs9kdpdkvk', 'Promo 12', 'KCKDK', 'PERCENTAGE', 10.00, 'HHj', 100.00, 20.00, 10, 0, '2025-07-17 00:00:00.000', '2025-07-24 00:00:00.000', 1, '2025-07-01 16:08:00.609', '2025-07-02 14:24:33.488', 'cmckp8tkl0000v4bszigaelx0');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `id` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `time` varchar(191) NOT NULL,
  `partySize` int(11) NOT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `notes` text DEFAULT NULL,
  `specialRequests` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `customerId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `isVisible` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `customerId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `response` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reviews`
--

INSERT INTO `reviews` (`id`, `rating`, `comment`, `isVisible`, `createdAt`, `updatedAt`, `customerId`, `userId`, `response`) VALUES
('cf18f765-567e-11f0-a14d-1c394712cdca', 4, 'Avis très positif, le service était excellent.', 1, '2025-07-01 15:32:10.000', '2025-07-01 15:32:10.000', 'cus_abc123', 'cmc93trv70000v4t0793rjzn5', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `postalCode` varchar(191) DEFAULT NULL,
  `restaurantName` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deliveryRadius` varchar(191) DEFAULT NULL,
  `hours` varchar(191) DEFAULT NULL,
  `isOpen` tinyint(1) NOT NULL DEFAULT 1,
  `minimumOrder` decimal(10,2) DEFAULT NULL,
  `cuisine` varchar(191) DEFAULT NULL,
  `role` enum('ADMIN','RESTAURANT','CUSTOMER') NOT NULL DEFAULT 'RESTAURANT',
  `notifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`notifications`)),
  `security` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`security`)),
  `customMessage` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone`, `address`, `city`, `postalCode`, `restaurantName`, `description`, `logo`, `isActive`, `createdAt`, `updatedAt`, `deliveryRadius`, `hours`, `isOpen`, `minimumOrder`, `cuisine`, `role`, `notifications`, `security`, `customMessage`) VALUES
('cmc6n7zpg0002v4zwvdbu5hpv', 'papa@gmail.com', '$2b$12$2JDxmOhSBYyKzALAM9d2n.WZDcD3a2EapKJ55saE27dXAQT9J70ka', 'Belahlou', '+212600461082', 'AV MOHAMED BOUZIANE', 'Casablanca', NULL, 'RAW', NULL, NULL, 1, '2025-06-21 19:39:59.237', '2025-06-21 19:39:59.237', NULL, NULL, 1, NULL, 'Marrocaine', 'RESTAURANT', NULL, NULL, NULL),
('cmc93trv70000v4t0793rjzn5', 'belahlouayman@gmail.com', '$2b$12$dDDzC2AMBcoehc8Oh404F.uayHRwomc4c2vTGJ7zU9kLi66GtS9A.', 'Anass', '+212600461081', 'AV MOHAMED BOUZIANE RES EL HOUDA IMM 30 NR 01', 'Casablanca', NULL, 'POO', 'Bonjour pap', NULL, 1, '2025-06-23 13:00:21.715', '2025-06-27 14:56:52.634', '5 KM', '1h00 - 23h00', 1, 200.00, 'Marrocaine', 'RESTAURANT', NULL, NULL, 'Welcome '),
('cmce3asp90000v47cdjuectl2', 'aymenbelahlou748@gmail.com', '$2b$12$JIa4uoOYt42j5yVjs18Xj.vfpw43eBY.zG44id8zPOBni/Lq/rNSG', 'Aymen', '0600461082', 'AV MED', 'Casablanca', NULL, 'PAP JONES', NULL, NULL, 1, '2025-06-27 00:44:27.213', '2025-06-27 00:44:27.213', NULL, NULL, 1, NULL, 'Marocaine', 'RESTAURANT', NULL, NULL, NULL),
('cmckp8tkl0000v4bszigaelx0', 'Ahmed@gmail.com', '$2b$12$WfZeynbQBBYVXZErulsN8e8Cy2mbKx3no.pzGo03WO5OXc9l6Y9py', 'Ahmed', '0600448899', 'Casa derb ghelef', 'Casablanca', NULL, 'Tacos Ahmed', 'ckdkckd', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAJukAACbpAG+CklmAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAwBQTFRF////AAAAAAAAAAAAA', 1, '2025-07-01 15:45:23.637', '2025-07-01 16:26:40.682', '5Km', '1h00 - 23h00', 1, 100.00, 'Marrocaine', 'RESTAURANT', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('01988ea9-0c48-47e6-ac1f-547a00eed496', 'b5436ffda18489760d29f4a360aa0dad924b4ec7b2201d951c84f12899e939cf', '2025-06-30 10:31:29.005', '20250630103128_add_campagne_tt', NULL, NULL, '2025-06-30 10:31:28.844', 1),
('07c4f11b-e2da-43d2-bfbc-ae1577555f4d', '5974ac4facaf5c9fa1dae668a0c5e72a77acca8e929af9d51c3de055d311fd22', '2025-06-23 13:48:24.489', '20250623134503_add_updated_at_to_dish', NULL, NULL, '2025-06-23 13:48:24.444', 1),
('09f8a4c3-2db8-4179-9b24-015b712f7962', '0f4f94f2fea5da2b3141338e7f1a155eedf70cd93a6b4c1a0febf9b5dc15b479', '2025-06-27 14:25:51.006', '20250627142550_add_custom_message', NULL, NULL, '2025-06-27 14:25:50.979', 1),
('136a0830-7c9e-4ef3-bcb7-03c7dbdddb6d', 'bf2b6a3b43536057f6978c4b95d396e9c5ea2236855ba5ddfa142c93660cb68b', '2025-06-21 19:28:58.327', '20250619090601_add_restaurant_info_to_users', NULL, NULL, '2025-06-21 19:28:58.290', 1),
('26a12bc2-3472-4cf0-a100-f26a8015b421', '440ac6bfb57e050a619474453abd35064d4df47da1864ba05ae0fe81878b1f4c', '2025-06-30 15:21:33.067', '20250630152132_add_menu_settings', NULL, NULL, '2025-06-30 15:21:32.924', 1),
('2ba8bb12-cdff-46da-8969-a036d75deca2', 'dfcef3e6dc63e373669595ef22dabe2fa4882c6dc5c3c2abae28d224c88e16ed', '2025-06-27 15:31:56.921', '20250627153156_add_legal_documents', NULL, NULL, '2025-06-27 15:31:56.708', 1),
('3e1cd494-0b83-42d7-9b8b-ff57357b3cb0', '28e28599c6eb556309fdcb60e469e14b11a70c3cd369d95681a8a9fc4beaac07', '2025-07-01 11:55:23.186', '20250701115523_add_response', NULL, NULL, '2025-07-01 11:55:23.151', 1),
('527c9c20-909f-4da5-8564-1c4d6ab5ca46', '8cf1c3140b26e00d66a1e4432d398dc364317c372c267f8cda674d1ca215a89b', '2025-06-23 13:11:39.852', '20250623131139_remove_updated_at', NULL, NULL, '2025-06-23 13:11:39.792', 1),
('698d7219-2537-463c-b1e6-1a5e48445e00', 'f1b2e54cfccd56b1fd5e900ae284a59f9a526fe902b7e767bc29aa8a4bba2cf5', '2025-07-02 14:40:39.249', '20250702144039_add_user_id_to_customer', NULL, NULL, '2025-07-02 14:40:39.094', 1),
('6a3e9330-3db3-42d9-a070-b5415e7e2801', '27f544921d6e4c014914c6f0f9612eeb995d3adbadb0af85cbd12d17d77682b4', '2025-06-30 10:28:21.532', '20250630102821_add_campagne_relation', NULL, NULL, '2025-06-30 10:28:21.393', 1),
('720e9bb2-6179-4efb-8717-328480e54d18', '3c79022941bf3c7f46c008e169d9d731c8bd8babfb9475d712f3cebdbb9f5da2', '2025-06-23 13:48:34.128', '20250623134833_nww', NULL, NULL, '2025-06-23 13:48:33.970', 1),
('77b06654-4273-4eff-9079-1fdd294b4caf', 'f36085504d656c9bcac1188c4d97553733e71c35016822378e23f76f3be8a79f', '2025-06-21 19:28:58.378', '20250619095039_add_field', NULL, NULL, '2025-06-21 19:28:58.357', 1),
('887ef0b9-d773-414f-a3e7-273538b6e8c7', 'a4edbf63ff8c12189d11f86305263a1a206e4876c385c3336f08f701ca50ea6d', '2025-06-27 15:21:27.612', '20250627152127_add_legaldocuments', NULL, NULL, '2025-06-27 15:21:27.455', 1),
('900fd85b-5469-4911-8e35-0e12582ef2a5', 'd65ffafa99dff5a49e102d2ed8e01765497d462f1db602e680134f8e3e4e6a3c', '2025-06-21 19:28:58.414', '20250621171507_add_account_fields', NULL, NULL, '2025-06-21 19:28:58.386', 1),
('9844aa3c-4ea2-4968-a81f-1a567efc5eec', 'a8b9b8887905ea7f28f87930027dd282685b0749e85207032323df4a6b77e6fb', '2025-06-21 19:28:58.351', '20250619094349_add_cuisine_field', NULL, NULL, '2025-06-21 19:28:58.331', 1),
('bc23ec0d-dc07-4063-8d8b-53c8adbdeb17', 'bff5f38618238afdd7029bcf83ff49f6b073f30522c7cc780f384fa6a3db7a81', '2025-06-21 19:30:21.970', '20250621193021_mignv', NULL, NULL, '2025-06-21 19:30:21.706', 1),
('cd691109-67b6-4bc6-ab4c-36016976f756', 'd618990afe611a346b922cf83dd7f6fd0906e1a1fd0bb13e2305cde246b32b76', '2025-06-21 19:28:58.286', '20250615131743_new_migr', NULL, NULL, '2025-06-21 19:28:56.338', 1),
('d8449d2c-eed9-4520-9f32-f201d13d1376', '8f0ea8124351dc531f5b1ddade8014913a15a2e739303f3a70f5178ec752f74e', '2025-06-30 15:57:45.366', '20250630155745_change_price', NULL, NULL, '2025-06-30 15:57:45.225', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `campagnes`
--
ALTER TABLE `campagnes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campagnes_userId_fkey` (`userId`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customers_email_key` (`email`),
  ADD KEY `customers_userId_fkey` (`userId`);

--
-- Index pour la table `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dishes_categoryId_fkey` (`categoryId`),
  ADD KEY `dishes_userId_fkey` (`userId`);

--
-- Index pour la table `legaldocuments`
--
ALTER TABLE `legaldocuments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `legalDocuments_userId_name_key` (`userId`,`name`);

--
-- Index pour la table `menu_settings`
--
ALTER TABLE `menu_settings`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_orderNumber_key` (`orderNumber`),
  ADD KEY `orders_customerId_fkey` (`customerId`),
  ADD KEY `orders_userId_fkey` (`userId`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_orderId_fkey` (`orderId`),
  ADD KEY `order_items_dishId_fkey` (`dishId`);

--
-- Index pour la table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_orderId_key` (`orderId`),
  ADD UNIQUE KEY `payments_transactionId_key` (`transactionId`),
  ADD KEY `payments_userId_fkey` (`userId`);

--
-- Index pour la table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `promotions_code_key` (`code`),
  ADD KEY `promotions_userId_fkey` (`userId`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservations_customerId_fkey` (`customerId`),
  ADD KEY `reservations_userId_fkey` (`userId`);

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_customerId_fkey` (`customerId`),
  ADD KEY `reviews_userId_fkey` (`userId`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Index pour la table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `campagnes`
--
ALTER TABLE `campagnes`
  ADD CONSTRAINT `campagnes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `dishes`
--
ALTER TABLE `dishes`
  ADD CONSTRAINT `dishes_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `dishes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `legaldocuments`
--
ALTER TABLE `legaldocuments`
  ADD CONSTRAINT `legalDocuments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_dishId_fkey` FOREIGN KEY (`dishId`) REFERENCES `dishes` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `promotions`
--
ALTER TABLE `promotions`
  ADD CONSTRAINT `promotions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `reservations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
