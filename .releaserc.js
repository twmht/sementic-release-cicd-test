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
    // 1. 分析提交
    "@semantic-release/commit-analyzer",
    // 2. 生成 release notes
    "@semantic-release/release-notes-generator",
    // 3. 執行命令來修改 version.py 文件
    //    這個步驟會在 @semantic-release/git 之前運行
    [
      "@semantic-release/exec",
      {
        // `prepareCmd` 會在 prepare 階段執行
        // 使用普通字符串，讓 exec 插件自己替換 ${nextRelease.version}
        prepareCmd: 'sed -i \'s/__version__ = .*/__version__ = "${nextRelease.version}"/\' src/sementic_release_test/version.py',
      }
    ],
    // 4. 提交被修改的文件
    [
      "@semantic-release/git",
      {
        // `assets` 告訴 git 插件需要提交哪些文件
        // 因為上一步 exec 插件已經修改了 version.py，git 插件現在可以找到它的變更
        assets: [
          "src/sementic_release_test/version.py"
        ],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    // 5. 在 GitHub 創建 Release
    "@semantic-release/github"
  ]
};
