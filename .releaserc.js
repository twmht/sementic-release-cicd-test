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
        assets: [] // 这里可以添加发布到 GitHub Release 的构建产物，目前留空
      }
    ],
    [
      "@semantic-release/git",
      {
        prepare: [
          // 注意：这里的路径是相对项目根目录的
          `sed -i "s/__version__ = \\"[0-9.]\\+\\(-dev\\.[0-9]\\+\\)\?\\"/__version__ = \\"${nextRelease.version}\\"/g" src/sementic_release_test/version.py`,
          "git add CHANGELOG.md"
        ],
        assets: [
          "CHANGELOG.md",
          "src/sementic_release_test/version.py" // 确保这个文件被提交回仓库
        ],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
};
