#!/bin/bash
set -e

cd java
mvn package
cp WebAPI/target/javascript/* ../gui/public/
