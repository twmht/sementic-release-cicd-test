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
    // 确保 @semantic-release/changelog 在 @semantic-release/git 之前
    // 这样 changelog 文件才能在 git 插件提交前生成并被 git add
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md" // 指定 changelog 文件名
      }
    ],
    [
      "@semantic-release/github",
      {
        assets: []
      }
    ],
    [
      "@semantic-release/git",
      {
        prepare: async (
          { nextRelease: { version } },
          { logger, cwd, env, stdout, stderr, ...context }
        ) => {
          const { execa } = await import('execa');
          const filePath = 'src/sementic_release_test/version.py'; // 确认此路径正确
          const newVersion = version;

          logger.log(`Updating ${filePath} to version ${newVersion}`);

          await execa(
            'sed',
            [
              '-i',
              `s/__version__ = \\"[0-9.]\\+\\(-dev\\.[0-9]\\+\\)\?\\"/__version__ = \\"${newVersion}\\"/g`,
              filePath,
            ],
            { cwd, env, stdout, stderr }
          );

          // CHANGELOG.md 现在应该是由 @semantic-release/changelog 生成的，我们只需要添加它
          await execa(
            'git',
            ['add', 'CHANGELOG.md'],
            { cwd, env, stdout, stderr }
          );

          logger.log('Files prepared for commit.');
        },
        assets: [
          "CHANGELOG.md",
          "src/sementic_release_test/version.py"
        ],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
};
