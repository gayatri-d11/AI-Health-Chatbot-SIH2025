#!/usr/bin/env python3
"""
YOGIC.ai Rasa Training and Deployment Script
Government-validated health responses with emergency detection
"""

import subprocess
import sys
import os
import time

def run_command(command, description):
    """Run shell command with error handling"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, 
                              capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error in {description}: {e}")
        print(f"Output: {e.output}")
        return False

def main():
    print("🩺 YOGIC.ai - Health Assistant Training Script")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("domain.yml"):
        print("❌ Please run this script from the rasa-health-bot directory")
        sys.exit(1)
    
    # Install dependencies
    if not run_command("pip install -r requirements.txt", "Installing dependencies"):
        sys.exit(1)
    
    # Train the model
    if not run_command("rasa train", "Training YOGIC.ai model"):
        sys.exit(1)
    
    print("\n🎯 Training completed! Your YOGIC.ai model is ready.")
    print("\n📋 To run the assistant:")
    print("1. Start action server: rasa run actions")
    print("2. Start Rasa server: rasa run --enable-api --cors \"*\"")
    print("3. Test in shell: rasa shell")
    
    # Ask if user wants to test immediately
    test_now = input("\n🤖 Would you like to test YOGIC.ai now? (y/n): ")
    if test_now.lower() == 'y':
        print("\n🚀 Starting YOGIC.ai in shell mode...")
        print("Type 'hello' to start, '/stop' to exit")
        subprocess.run("rasa shell", shell=True)

if __name__ == "__main__":
    main()