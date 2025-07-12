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
    // 1. 生成 changelog
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    // 2. 修改版本文件，並將所有變更（包括 changelog）提交到 Git
    [
      "@semantic-release/git",
      {
        // `assets` 列表告訴插件哪些文件需要被包含在 release commit 中。
        // 插件會自動 `git add` 這些文件。
        assets: [
          "CHANGELOG.md",
          "src/sementic_release_test/version.py"
        ],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",

        // `prepare` 函式在提交前執行
        prepare: async (pluginConfig, context) => {
          const { nextRelease, logger, cwd, env } = context;
          const { execa } = await import('execa'); // 動態導入 execa

          const filePath = 'src/sementic_release_test/version.py';
          const newVersion = nextRelease.version;

          logger.log(`Updating version in ${filePath} to ${newVersion}`);

          // 使用 sed 更新版本號。
          // 注意：我們不再手動執行 'git add'。
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
    // 3. 在 GitHub 上創建 Release
    [
      "@semantic-release/github",
      {
        assets: []
      }
    ]
  ]
};
