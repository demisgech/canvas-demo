# Ethiopian Flag Project Setup

## Quick Start

### 1. Install Bun

#### **Windows**
```powershell
# Using PowerShell (recommended)
powershell -c "irm bun.sh/install.ps1 | iex"

# Or using cmd
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://bun.sh/install.ps1'))" && SET "PATH=%PATH%;%USERPROFILE%\.bun\bin"
```

<!-- or use chocolatey (I highly recommend you to use it, it is popular in windows ecosystem) -->
```shell
choco install bun

```

#### **Linux/macOS**
```bash
curl -fsSL https://bun.sh/install | bash
```

#### **Verify Installation**
```bash
bun --version
# Should show something like: bun 1.x.x
```
 **Extract the file
 ```shell
cd yohannes_getachew_0390_ethiopia
 ```
### 4. Install Dependencies
```bash
bun install
```

### 5. Run the Project
```bash
bun run dev
```

### 6. Open Browser
Navigate to: `http://localhost:3000`

---

## Troubleshooting

### If `bun` command not found:
**Windows:** Add to PATH: `C:\usr\YourUsername\.bun\bin`
**Linux/macOS:** Add to shell config:
```bash
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### If port 3000 is busy:
Bun will automatically use another port. Check the terminal output.

### If TypeScript errors:
```bash
# Install TypeScript globally
bun add -g typescript
```

---

## Why I am using **bun** here?

- **Live reload**: Changes to files automatically update in browser
- **No build step**: Bun compiles TypeScript on the fly
- **Hot refresh**: Just save files and refresh browser


**Want to know about bun?** Check [Bun's documentation](https://bun.sh/docs) or run `bun --help`