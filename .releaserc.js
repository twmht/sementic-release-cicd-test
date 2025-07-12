module.exports = {
  branches: [
    {
      name: "dev",
      prerelease: "dev"
    },
    {
      name: "main",
      prerelease: false
    }
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/github",
      {
        assets: []
      }
    ],
    [
      "@semantic-release/git",
      {
        // 核心改动在这里：将 prepare 从字符串数组改为一个异步函数
        prepare: async (
          { nextRelease: { version } }, // 解构 nextRelease 对象，获取 version 属性
          { logger, cwd, env, stdout, stderr, ...context } // 可以获取 logger 和其他 context
        ) => {
          const { execa } = await import('execa'); // 动态导入 execa 来执行 shell 命令
          const filePath = 'src/my_package/__version__.py';
          const newVersion = version;

          logger.log(`Updating ${filePath} to version ${newVersion}`);

          // 使用 execa 执行 sed 命令来更新版本文件
          await execa(
            'sed',
            [
              '-i',
              `s/__version__ = \\"[0-9.]\\+\\(-dev\\.[0-9]\\+\\)\?\\"/__version__ = \\"${newVersion}\\"/g`,
              filePath,
            ],
            { cwd, env, stdout, stderr }
          );

          // 添加 CHANGELOG.md 到暂存区
          await execa(
            'git',
            ['add', 'CHANGELOG.md'],
            { cwd, env, stdout, stderr }
          );

          logger.log('Files prepared for commit.');
        },
        assets: [
          "CHANGELOG.md",
          "src/my_package/__version__.py"
        ],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
};
