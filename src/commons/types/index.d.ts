interface WallpaperInfo {
  id: string // 壁纸ID
  fileType: string // 壁纸文件类型
  fileName: string // 壁纸文件名，下载时生成
  resolution: string // 分辨率
  tags: string[] // 标签
  category: string // 分类
  purity: string // 纯度
  imgUrl: string // 壁纸URL
  thumbs: {
    original: string // 原始大小
    small: string // 小尺寸
  }
  createdAt: number
}

// 数据源信息
interface DataSourceInfo {
  id?: string // 数据源ID-系统分配
  name: string // 数据源名称
  description?: string // 描述
  author?: string // 作者
  email?: string // 邮箱
  version: string // 版本
  apiVersion?: string // API版本
  homepage?: string // 主页
  hosts: string[] // 访问域名列表
  categories?: string[] // 分类列表
  resolutions?: string[] // 分辨率列表
  ratios?: string[] // 比例列表
  sorts?: string[] // 排序方式列表
  purity?: string[] // 纯度列表
  supportBanNsfw: boolean // 是否支持屏蔽NSFW
}

// 壁纸列表数据
interface PageData {
  data: WallpaperInfo[]
  meta: {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
  }
}

// 数据源API
interface DataSourceApi {
  getWallpapers: (
    page: number,
    sortBy: string,
    categories: string[],
    resolutions: string[],
    ratios: string[],
    purity: string[],
    banNsfw: boolean
  ) => Promise<PageData[]>
  search: (page: number, keyword: string, banNsfw: boolean) => Promise<PageData[]>
}
