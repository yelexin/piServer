/*
 Navicat Premium Data Transfer

 Source Server         : pi-db
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 31/01/2022 12:02:05
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE sqlite_sequence(name,seq);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "github_id" INTEGER,
  "email" TEXT,
  "nickname" TEXT,
  "avatar" TEXT
);

-- ----------------------------
-- Table structure for v2ray_servers
-- ----------------------------
DROP TABLE IF EXISTS "v2ray_servers";
CREATE TABLE "v2ray_servers" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "v2ray_config_json" TEXT,
  "vmess_uri" TEXT,
  "vmess_uri_raw_json" TEXT,
  "server_name" TEXT
);

PRAGMA foreign_keys = true;
