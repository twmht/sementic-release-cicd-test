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
    // 1. 生成 changelog 文件
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    // 2. 使用 sed 更新 Python 版本文件
    //    這個步驟必須在 @semantic-release/git 之前，才能讓 git 插件提交變更
    [
      "@semantic-release/exec",
      {
        // 'prepareCmd' 會在打包和發佈前執行
        // ${nextRelease.version} 是 semantic-release 提供的變數
        prepareCmd: `sed -i 's/__version__ = .*/__version__ = "${nextRelease.version}"/' src/sementic_release_test/version.py`,
      }
    ],
    // 3. 提交變更並打上標籤
    [
      "@semantic-release/git",
      {
        // assets 告訴 git 插件哪些文件需要被加入到 release commit 中
        assets: [
          "CHANGELOG.md",
          "src/sementic_release_test/version.py",
          // 如果你的 pyproject.toml 也需要被提交，也加進來
          // "pyproject.toml" 
        ],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    // 4. 在 GitHub 上建立 Release
    [
      "@semantic-release/github",
      {
        assets: [] // 如果你需要上傳建置好的檔案 (e.g., .whl, .tar.gz)，可以加在這裡
      }
    ]
  ]
};j
