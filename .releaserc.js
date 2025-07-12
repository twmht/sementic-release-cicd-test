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
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    // 使用 @semantic-release/exec 插件來執行命令
    [
      "@semantic-release/exec",
      {
        // 使用普通字串（單引號），並轉義 sed 命令中的內部單引號
        // 這樣 ${nextRelease.version} 會被當作字串傳遞給插件，由插件在正確的時機進行替換
        prepareCmd: 'sed -i \'s/__version__ = .*/__version__ = "${nextRelease.version}"/\' src/sementic_release_test/version.py',
      }
    ],
    // git 插件會提交上面步驟中修改過的文件
    [
      "@semantic-release/git",
      {
        assets: [
          "CHANGELOG.md",
          "src/sementic_release_test/version.py"
        ],
        // 這裡的 ${...} 語法是正確的，因為 git 插件會處理它
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    // github 插件負責創建 GitHub Release
    [
      "@semantic-release/github",
      {
        assets: []
      }
    ]
  ]
};
