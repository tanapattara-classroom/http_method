#!/bin/sh

# Install specific dependencies that might be missing
echo "Installing jsonwebtoken package..."
npm install jsonwebtoken

echo "Installing bcryptjs package..."
npm install bcryptjs

echo "Installing validator package..."
npm install validator

echo "All dependencies installed successfully!" 