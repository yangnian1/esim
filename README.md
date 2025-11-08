
🏠 开发环境命令：
npm run dev:local          # 连接本地API
npm run dev:server         # 连接服务器API
npm run dev:debug          # 启用调试模式
npm run dev:local-debug    # 本地API + 调试模式
npm run dev:server-debug   # 服务器API + 调试模式

🔧 环境切换命令：
npm run env:local          # 切换到本地环境
npm run env:server         # 切换到服务器环境
npm run debug:enable       # 启用调试
npm run debug:disable      # 禁用调试

📦 构建命令：
npm run build:local        # 本地环境构建
npm run build:server       # 服务器环境构建

git上传后，在服务器此项目目录下执行 ./deploy.sh 脚本，自动构建