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
    // 1. 分析提交，決定下一個版本號
    "@semantic-release/commit-analyzer",
    // 2. 根據提交生成發行說明的內容 (這會保留 release notes)
    "@semantic-release/release-notes-generator",
    // 3. 修改版本文件並提交到 Git
    [
      "@semantic-release/git",
      {
        // `assets` 列表現在只包含 version.py。
        // 我們移除了 "CHANGELOG.md"，因為不再生成它。
        assets: [
          "src/sementic_release_test/version.py"
        ],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",

        // `prepare` 函式在提交前執行，負責更新版本文件
        prepare: async (pluginConfig, context) => {
          const { nextRelease, logger, cwd, env } = context;
          const { execa } = await import('execa'); // 動態導入 execa

          const filePath = 'src/sementic_release_test/version.py';
          const newVersion = nextRelease.version;

          logger.log(`Updating version in ${filePath} to ${newVersion}`);

          // 使用 sed 更新版本號
          await execa(
            'sed',
            [
              '-i',
              `s/__version__ = .*/__version__ = "${newVersion}"/`,
              filePath
            ],
            { cwd, env }
          );

          logger.log('Version file updated successfully.');
        }
      }
    ],
    // 4. 在 GitHub 上創建 Release，並使用第 2 步生成的 notes
    [
      "@semantic-release/github",
      {
        assets: []
      }
    ]
  ]
};
