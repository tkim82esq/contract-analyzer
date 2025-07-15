# Contract Analyzer - Troubleshooting Guide

## 🚀 How to Start the App Reliably

### Option 1: Clean Start (Recommended)

```bash
npm run dev:clean
```

This will:

- Kill any processes on port 3000
- Clear the .next cache
- Start fresh on port 3001

### Option 2: Force Different Port

```bash
npm run dev:force
```

Uses port 3002 if 3001 is occupied

### Option 3: Manual Clean Start

```bash
npm run port:kill
npm run cache:clear
npm run dev
```

---

## 🌐 "Site Can't Be Reached" Solutions

### Step 1: Check What's Running

```bash
npm run port:check
```

### Step 2: Kill All Processes

```bash
npm run port:kill
```

### Step 3: Restart Clean

```bash
npm run dev:clean
```

### Step 4: Check Your URLs

- **Primary**: http://localhost:3001
- **Fallback**: http://localhost:3002
- **Original**: http://localhost:3000 (not used)

### Step 5: Network Issues

```bash
# Check if server is actually running
curl http://localhost:3001

# Check network interface
npm run health:check
```

---

## 🔧 Common Issues and Fixes

### Issue: Port Already in Use

**Symptoms**: `Error: listen EADDRINUSE :::3001`

**Fix**:

```bash
npm run port:kill
npm run dev:clean
```

### Issue: .next Folder Corrupted

**Symptoms**: Build errors, module not found errors

**Fix**:

```bash
npm run cache:clear
npm run dev
```

### Issue: Multiple Terminal Sessions

**Symptoms**: Multiple servers running, confusion about which port

**Fix**:

```bash
# Check what's running
node scripts/dev-helper.js

# Kill everything
npm run port:kill

# Start fresh
npm run dev:clean
```

### Issue: File Watching Problems (macOS)

**Symptoms**: Hot reload not working, changes not detected

**Fix**:

```bash
# Check file limits
ulimit -n

# Increase if needed (temporary)
ulimit -n 4096

# Or restart with verbose logging
npm run dev:verbose
```

### Issue: Memory Problems

**Symptoms**: Slow performance, crashes

**Fix**:

```bash
# Check memory usage
npm run health:check

# Clear all caches
npm run cache:clear
rm -rf node_modules
npm install
npm run dev:clean
```

### Issue: Antivirus Blocking

**Symptoms**: Intermittent connection issues, slow startup

**Fix**:

```bash
# Check for antivirus interference
node scripts/dev-helper.js

# Add project folder to antivirus exclusions
# (Check your antivirus settings)
```

---

## 🆘 Emergency Reset Commands

### Nuclear Option - Reset Everything

```bash
# Kill all processes
npm run port:kill

# Clear all caches
npm run cache:clear

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall everything
npm install

# Start fresh
npm run dev:clean
```

### Quick Reset (Less Destructive)

```bash
npm run port:kill && npm run cache:clear && npm run dev:clean
```

### Debug Mode

```bash
# Start with debugging enabled
npm run dev:debug

# Start with verbose logging
npm run dev:verbose

# Run full diagnostics
node scripts/dev-helper.js
```

---

## 📋 Diagnostic Commands

### Check System Health

```bash
npm run health:check
```

### Check Port Usage

```bash
npm run port:check
```

### Full System Diagnostics

```bash
node scripts/dev-helper.js
```

### Check Running Processes

```bash
ps aux | grep -E "(node|npm|next)" | grep -v grep
```

### Check File Watching Limits (macOS)

```bash
sysctl kern.maxfiles
sysctl kern.maxfilesperproc
```

---

## 🎯 Quick Reference

| Problem          | Command                   |
| ---------------- | ------------------------- |
| Can't start app  | `npm run dev:clean`       |
| Port in use      | `npm run port:kill`       |
| Build errors     | `npm run cache:clear`     |
| Nothing works    | Nuclear reset (see above) |
| Check status     | `npm run port:check`      |
| Alternative port | `npm run dev:force`       |

---

## 📞 Still Having Issues?

1. **Run diagnostics**: `node scripts/dev-helper.js`
2. **Check the logs**: Look at terminal output for specific error messages
3. **Try nuclear reset**: Use the emergency commands above
4. **Check Node version**: Ensure you're using Node.js 18+ (`node --version`)
5. **Restart your terminal**: Sometimes environment variables get stuck

---

## 🔍 Log Files

- **Development logs**: `dev.log` (if it exists)
- **npm debug logs**: `~/.npm/_logs/`
- **Next.js logs**: Terminal output during `npm run dev`

---

_Last updated: Created with permanent fixes for reliable development_
