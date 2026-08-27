/**
 * Impressum 的数据源。
 *
 * 德国 DDG §5（原 TMG §5）要求商业网站公示运营者信息，
 * 而本站靠联盟佣金创收，属于「geschäftsmäßig」。
 * 另外文章属于编辑内容，MStV §18 还要求写明内容负责人。
 *
 * 🔴 **这里的值必须是真实的。** 页面在填齐之前会 notFound()，
 * 页脚也不会出现入口 —— 宁可暂时没有 Impressum，
 * 也绝不能对外发布一份写着占位符或编造信息的 Impressum，
 * 那比没有更糟（此前那份写的是「LaoseSIM Limited，老挝万象」，已删）。
 *
 * ⚠️ 这不是法律意见。填完建议用 e-recht24 之类的生成器或律师核对一遍，
 * 尤其是经营形式（个人 / Kleinunternehmer / GmbH）对应的必填项不一样。
 */
export interface ImpressumData {
  /** 经营者姓名。个人就是本人姓名，公司则是公司全称 + 法定代表人 */
  name: string
  /** 若为公司，法定代表人（Vertretungsberechtigter）；个人经营留空 */
  representative?: string
  /** 街道 + 门牌号。不能用邮政信箱 */
  street: string
  /** 邮编 + 城市 */
  city: string
  /** 国家 */
  country: string
  /** 联系邮箱 —— DDG 要求能「快速电子联系」 */
  email: string
  /** 电话。不是硬性要求，但只留邮箱时争议更多，能填就填 */
  phone?: string
  /** 增值税识别号（USt-IdNr.，§27a UStG）。没有就留空 */
  vatId?: string
  /** 商业登记信息，如 "Amtsgericht München, HRB 12345"。个人经营留空 */
  registration?: string
  /**
   * MStV §18 Abs. 2 的内容负责人。
   * 通常就是经营者本人；留空时页面用 name + 地址兜底。
   */
  contentResponsible?: string
}

/** 🔴 填这里。全部必填项非空之后 /de/impressum 才会存在 */
export const IMPRESSUM: ImpressumData = {
  name: '',
  representative: '',
  street: '',
  city: '',
  country: 'Deutschland',
  email: '',
  phone: '',
  vatId: '',
  registration: '',
  contentResponsible: '',
}

/** DDG 要求的最小集合：谁、在哪、怎么联系 */
const REQUIRED: (keyof ImpressumData)[] = ['name', 'street', 'city', 'country', 'email']

export function isImpressumConfigured(data: ImpressumData = IMPRESSUM): boolean {
  return REQUIRED.every((k) => String(data[k] ?? '').trim().length > 0)
}
