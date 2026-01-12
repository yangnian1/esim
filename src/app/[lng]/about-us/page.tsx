'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'About Us',
    subtitle: 'Hi, we are hello esims',
    tagline: 'No.1 Tourist eSIM Provider for Travelers Worldwide',
    description: 'hello esims is a digital service provider that offers eSIM cards to travelers worldwide, making it easier and much more convenient for them to stay connected during their trip.',
    description2: 'Whether you\'re looking to browse the web, stay in touch with loved ones, or navigate the city with ease, eSIM technology has the potential to enhance your travel experience. That is where hello esims comes in.',
    guarantee: 'The guarantee of a good connection, everywhere, immediately, all the time',
    features_title: 'Our eSIM Features',
    feature_online: 'Online Purchase',
    feature_online_desc: 'Buy online and receive eSIM QR code in minutes.',
    feature_coverage: 'Full Coverage',
    feature_coverage_desc: 'Get covered whenever and wherever you travel',
    feature_easy: 'Easy to Use',
    feature_easy_desc: 'Scan a QR code and configure in few steps',
    mission_title: 'Our Mission',
    mission_text: 'To provide seamless connectivity for travelers, making sure that they can communicate with their family and friends, access the Internet, and navigate their way all around the world without any hassles. We understand the importance of staying connected these days, and we are committed to offering a reliable and efficient digital solution to travelers who visit different countries without any barriers of communication.',
    vision_title: 'Our Vision',
    vision_text: 'To be a reputable travel eSIM provider worldwide. We work hard to provide more and more accurate and reliable products to our customers and possible customer experience.',
    why_title: 'Why Choose Us?',
    why_no_remove: 'No need to remove sim card',
    why_no_remove_desc: 'Our eSIMs allow you to make calls, send text messages, and access the internet like you would with a physical sim card, without opening your sim card tray.',
    why_various: 'Various data plans',
    why_various_desc: 'We understand that every traveler has unique needs and preferences. So we offer a wide range of eSIM data plans to choose from, depending on your specific needs.',
    why_digital: '100% digital and easy to use',
    why_digital_desc: 'Our eSIMs can be purchased online wherever and whenever you are, before your trip. After arriving at your destination, the eSIMs will activate automatically when being connected to a supported network and you can start using it right away.',
    why_saving: 'Money saving',
    why_saving_desc: 'Our plans are competitively priced, we strive to offer the best value for money to our customers. Using our eSIMs at real local rates, all prepaid, you do not need to worry about international roaming fees.',
    why_support: '24/7 multilingual customer support',
    why_support_desc: 'We offer 24/7 customer support for 365 days per year, in different languages such as English, Vietnamese, Chinese, Japanese, Spanish, so you can reach out to us anytime if you have any questions or concerns.',
    values_title: 'Our Core Values',
    value_customer: 'Customer Focused',
    value_customer_desc: 'We recognised that customers are the reason for our success in business. We focus on providing a positive customer experience both at the point of sale and after sale so as to gain competitive advantage.',
    value_reliability: 'Reliability',
    value_reliability_desc: 'We work on a flat rate, prepaid basis, so you will never be faced by an unpleasant surprise. We aim for long-term relations with our clients, partners, suppliers and employees, so transparency and honesty are essential values for us.',
    value_integrity: 'Integrity',
    value_integrity_desc: 'Transparency and open communication are necessary to build lasting relationships. In all our relations, whether with customers, suppliers, partners or our own employees, we aim to build trust and transparency through responsible actions.',
    value_innovation: 'Innovation',
    value_innovation_desc: 'A bit better every single day. We do things differently and try to upgrade and develop new services to provide even better connectivity for our customers no matter where they are.',
    international_title: 'We are International eSIM Provider',
    international_text: 'hello esims is an international eSIM provider offering services to a wide range of countries including those in Asia, Europe, Oceania, and Africa, etc. hello esims offers a convenient solution for travelers seeking to avoid the hassle of physical SIM cards and roaming charges. With global coverage and user-friendly platform, hello esims is an excellent option for frequent travelers and digital nomads looking for a seamless eSIM experience.',
    leadership_title: 'Our Leadership Team',
    team_ceo: 'CEO / Founder',
    team_coo: 'Chief Operating Officer / Co-Founder',
    team_cos: 'Chief of Staff / Co-Founder',
    team_cto: 'Chief Technology Officer',
    convinced_title: 'Convinced?',
    convinced_text: 'Want to learn more about eSIM?',
    contact_us: 'Contact Us',
    back_to_home: 'Back to Home',
  },
  zh: {
    title: '关于我们',
    subtitle: '你好，我们是 hello esims',
    tagline: '全球旅行者首选 eSIM 服务提供商',
    description: 'hello esims 是一家数字服务提供商，为全球旅行者提供 eSIM 卡，让您在旅途中更轻松、更方便地保持连接。',
    description2: '无论您是想浏览网页、与亲人保持联系，还是轻松导航城市，eSIM 技术都能提升您的旅行体验。这就是 hello esims 的用武之地。',
    guarantee: '随时随地，即时连接，始终保证良好连接',
    features_title: '我们的 eSIM 特性',
    feature_online: '在线购买',
    feature_online_desc: '在线购买，几分钟内即可收到 eSIM QR 码。',
    feature_coverage: '全覆盖',
    feature_coverage_desc: '无论何时何地旅行，都能获得覆盖',
    feature_easy: '易于使用',
    feature_easy_desc: '扫描二维码，几步即可完成配置',
    mission_title: '我们的使命',
    mission_text: '为旅行者提供无缝连接，确保他们能够与家人和朋友沟通，访问互联网，在世界各地轻松导航，没有任何麻烦。我们了解保持连接的重要性，致力于为访问不同国家的旅行者提供可靠、高效的数字解决方案，消除沟通障碍。',
    vision_title: '我们的愿景',
    vision_text: '成为全球知名的旅行 eSIM 提供商。我们努力为客户提供越来越准确和可靠的产品，并提升客户体验。',
    why_title: '为什么选择我们？',
    why_no_remove: '无需移除 SIM 卡',
    why_no_remove_desc: '我们的 eSIM 允许您像使用实体 SIM 卡一样拨打电话、发送短信和访问互联网，无需打开 SIM 卡托盘。',
    why_various: '多种数据套餐',
    why_various_desc: '我们了解每位旅行者都有独特的需求和偏好。因此，我们提供多种 eSIM 数据套餐供您选择，以满足您的特定需求。',
    why_digital: '100% 数字化且易于使用',
    why_digital_desc: '我们的 eSIM 可以在您旅行前的任何时间、任何地点在线购买。到达目的地后，eSIM 在连接到支持的网络时会自动激活，您可以立即开始使用。',
    why_saving: '省钱',
    why_saving_desc: '我们的套餐价格具有竞争力，我们努力为客户提供最佳性价比。使用我们的 eSIM，按真实本地费率计费，全部预付费，您无需担心国际漫游费用。',
    why_support: '24/7 多语言客户支持',
    why_support_desc: '我们全年 365 天提供 24/7 客户支持，支持英语、越南语、中文、日语、西班牙语等多种语言，因此您可以随时联系我们，提出任何问题或疑虑。',
    values_title: '我们的核心价值观',
    value_customer: '以客户为中心',
    value_customer_desc: '我们认识到客户是我们业务成功的原因。我们专注于在销售点和售后提供积极的客户体验，以获得竞争优势。',
    value_reliability: '可靠性',
    value_reliability_desc: '我们采用统一费率、预付费方式，因此您永远不会面临意外。我们致力于与客户、合作伙伴、供应商和员工建立长期关系，因此透明度和诚实对我们来说是必不可少的价值观。',
    value_integrity: '诚信',
    value_integrity_desc: '透明度和开放沟通是建立持久关系的必要条件。在我们所有的关系中，无论是与客户、供应商、合作伙伴还是我们自己的员工，我们都旨在通过负责任的行动建立信任和透明度。',
    value_innovation: '创新',
    value_innovation_desc: '每天进步一点点。我们以不同的方式做事，努力升级和开发新服务，为客户提供更好的连接，无论他们在哪里。',
    international_title: '我们是国际 eSIM 提供商',
    international_text: 'hello esims 是一家国际 eSIM 提供商，为包括亚洲、欧洲、大洋洲和非洲等在内的多个国家提供服务。hello esims 为寻求避免实体 SIM 卡和漫游费用麻烦的旅行者提供便捷的解决方案。凭借全球覆盖和用户友好的平台，hello esims 是寻求无缝 eSIM 体验的频繁旅行者和数字游民的绝佳选择。',
    leadership_title: '我们的领导团队',
    team_ceo: '首席执行官 / 创始人',
    team_coo: '首席运营官 / 联合创始人',
    team_cos: '首席人事官 / 联合创始人',
    team_cto: '首席技术官',
    convinced_title: '心动了吗？',
    convinced_text: '想了解更多关于 eSIM 的信息？',
    contact_us: '联系我们',
    back_to_home: '返回首页',
  },
  vi: {
    title: 'Về Chúng Tôi',
    subtitle: 'Xin chào, chúng tôi là hello esims',
    tagline: 'Nhà cung cấp eSIM du lịch số 1 cho du khách toàn cầu',
    description: 'hello esims là nhà cung cấp dịch vụ kỹ thuật số cung cấp thẻ eSIM cho du khách trên toàn thế giới, giúp họ dễ dàng và thuận tiện hơn trong việc duy trì kết nối trong chuyến đi.',
    description2: 'Cho dù bạn muốn duyệt web, giữ liên lạc với người thân hay điều hướng thành phố một cách dễ dàng, công nghệ eSIM có tiềm năng nâng cao trải nghiệm du lịch của bạn. Đó là nơi hello esims xuất hiện.',
    guarantee: 'Đảm bảo kết nối tốt, mọi nơi, ngay lập tức, mọi lúc',
    features_title: 'Tính Năng eSIM Của Chúng Tôi',
    feature_online: 'Mua Trực Tuyến',
    feature_online_desc: 'Mua trực tuyến và nhận mã QR eSIM trong vài phút.',
    feature_coverage: 'Phủ Sóng Toàn Diện',
    feature_coverage_desc: 'Được phủ sóng bất cứ khi nào và bất cứ nơi đâu bạn đi du lịch',
    feature_easy: 'Dễ Sử Dụng',
    feature_easy_desc: 'Quét mã QR và cấu hình trong vài bước',
    mission_title: 'Sứ Mệnh Của Chúng Tôi',
    mission_text: 'Cung cấp kết nối liền mạch cho du khách, đảm bảo rằng họ có thể giao tiếp với gia đình và bạn bè, truy cập Internet và điều hướng đường đi khắp thế giới mà không gặp bất kỳ khó khăn nào. Chúng tôi hiểu tầm quan trọng của việc duy trì kết nối trong thời đại ngày nay, và chúng tôi cam kết cung cấp giải pháp kỹ thuật số đáng tin cậy và hiệu quả cho du khách đến các quốc gia khác nhau mà không có bất kỳ rào cản giao tiếp nào.',
    vision_title: 'Tầm Nhìn Của Chúng Tôi',
    vision_text: 'Trở thành nhà cung cấp eSIM du lịch uy tín trên toàn thế giới. Chúng tôi nỗ lực cung cấp ngày càng nhiều sản phẩm chính xác và đáng tin cậy cho khách hàng và trải nghiệm khách hàng tốt nhất có thể.',
    why_title: 'Tại Sao Chọn Chúng Tôi?',
    why_no_remove: 'Không cần tháo thẻ sim',
    why_no_remove_desc: 'eSIM của chúng tôi cho phép bạn gọi điện, gửi tin nhắn và truy cập internet như bạn làm với thẻ sim vật lý, mà không cần mở khay thẻ sim.',
    why_various: 'Nhiều gói dữ liệu',
    why_various_desc: 'Chúng tôi hiểu rằng mỗi du khách có nhu cầu và sở thích riêng. Vì vậy chúng tôi cung cấp nhiều gói dữ liệu eSIM để bạn lựa chọn, tùy thuộc vào nhu cầu cụ thể của bạn.',
    why_digital: '100% kỹ thuật số và dễ sử dụng',
    why_digital_desc: 'eSIM của chúng tôi có thể được mua trực tuyến bất cứ nơi đâu và bất cứ khi nào bạn muốn, trước chuyến đi của bạn. Sau khi đến điểm đến, eSIM sẽ tự động kích hoạt khi được kết nối với mạng được hỗ trợ và bạn có thể bắt đầu sử dụng ngay lập tức.',
    why_saving: 'Tiết kiệm tiền',
    why_saving_desc: 'Các gói của chúng tôi có giá cạnh tranh, chúng tôi nỗ lực cung cấp giá trị tốt nhất cho khách hàng. Sử dụng eSIM của chúng tôi với mức giá địa phương thực tế, tất cả đều trả trước, bạn không cần lo lắng về phí chuyển vùng quốc tế.',
    why_support: 'Hỗ trợ khách hàng đa ngôn ngữ 24/7',
    why_support_desc: 'Chúng tôi cung cấp hỗ trợ khách hàng 24/7 trong 365 ngày mỗi năm, bằng nhiều ngôn ngữ khác nhau như tiếng Anh, tiếng Việt, tiếng Trung, tiếng Nhật, tiếng Tây Ban Nha, vì vậy bạn có thể liên hệ với chúng tôi bất cứ lúc nào nếu có bất kỳ câu hỏi hoặc thắc mắc nào.',
    values_title: 'Giá Trị Cốt Lõi Của Chúng Tôi',
    value_customer: 'Tập Trung Vào Khách Hàng',
    value_customer_desc: 'Chúng tôi nhận ra rằng khách hàng là lý do cho sự thành công trong kinh doanh của chúng tôi. Chúng tôi tập trung vào việc cung cấp trải nghiệm khách hàng tích cực cả tại điểm bán hàng và sau bán hàng để giành được lợi thế cạnh tranh.',
    value_reliability: 'Đáng Tin Cậy',
    value_reliability_desc: 'Chúng tôi làm việc trên cơ sở giá cố định, trả trước, vì vậy bạn sẽ không bao giờ phải đối mặt với bất ngờ khó chịu. Chúng tôi hướng tới mối quan hệ lâu dài với khách hàng, đối tác, nhà cung cấp và nhân viên, vì vậy tính minh bạch và trung thực là những giá trị thiết yếu đối với chúng tôi.',
    value_integrity: 'Chính Trực',
    value_integrity_desc: 'Tính minh bạch và giao tiếp cởi mở là cần thiết để xây dựng mối quan hệ lâu dài. Trong tất cả các mối quan hệ của chúng tôi, cho dù với khách hàng, nhà cung cấp, đối tác hay nhân viên của chúng tôi, chúng tôi nhằm mục đích xây dựng niềm tin và tính minh bạch thông qua các hành động có trách nhiệm.',
    value_innovation: 'Đổi Mới',
    value_innovation_desc: 'Tốt hơn một chút mỗi ngày. Chúng tôi làm mọi thứ khác đi và cố gắng nâng cấp và phát triển các dịch vụ mới để cung cấp kết nối tốt hơn cho khách hàng của chúng tôi bất kể họ ở đâu.',
    international_title: 'Chúng Tôi Là Nhà Cung Cấp eSIM Quốc Tế',
    international_text: 'hello esims là nhà cung cấp eSIM quốc tế cung cấp dịch vụ cho nhiều quốc gia bao gồm các quốc gia ở Châu Á, Châu Âu, Châu Đại Dương và Châu Phi, v.v. hello esims cung cấp giải pháp tiện lợi cho du khách tìm cách tránh rắc rối với thẻ SIM vật lý và phí chuyển vùng. Với phạm vi phủ sóng toàn cầu và nền tảng thân thiện với người dùng, hello esims là lựa chọn tuyệt vời cho những du khách thường xuyên và digital nomad đang tìm kiếm trải nghiệm eSIM liền mạch.',
    leadership_title: 'Đội Ngũ Lãnh Đạo Của Chúng Tôi',
    team_ceo: 'Giám Đốc Điều Hành / Người Sáng Lập',
    team_coo: 'Giám Đốc Điều Hành / Đồng Sáng Lập',
    team_cos: 'Trưởng Nhân Sự / Đồng Sáng Lập',
    team_cto: 'Giám Đốc Công Nghệ',
    convinced_title: 'Đã Thuyết Phục?',
    convinced_text: 'Muốn tìm hiểu thêm về eSIM?',
    contact_us: 'Liên Hệ Chúng Tôi',
    back_to_home: 'Về Trang Chủ',
  },
  de: {
    title: 'Über Uns',
    subtitle: 'Hallo, wir sind hello esims',
    tagline: 'Nr. 1 Tourist eSIM Anbieter für Reisende weltweit',
    description: 'hello esims ist ein digitaler Dienstleister, der eSIM-Karten für Reisende weltweit anbietet und es ihnen erleichtert, während ihrer Reise verbunden zu bleiben.',
    description2: 'Egal, ob Sie im Internet surfen, mit Ihren Lieben in Kontakt bleiben oder die Stadt mühelos navigieren möchten, eSIM-Technologie kann Ihr Reiseerlebnis verbessern. Hier kommt hello esims ins Spiel.',
    guarantee: 'Die Garantie einer guten Verbindung, überall, sofort, jederzeit',
    features_title: 'Unsere eSIM-Funktionen',
    feature_online: 'Online-Kauf',
    feature_online_desc: 'Online kaufen und eSIM QR-Code in wenigen Minuten erhalten.',
    feature_coverage: 'Vollständige Abdeckung',
    feature_coverage_desc: 'Erhalten Sie Abdeckung, wann und wo immer Sie reisen',
    feature_easy: 'Einfach zu verwenden',
    feature_easy_desc: 'Scannen Sie einen QR-Code und konfigurieren Sie in wenigen Schritten',
    mission_title: 'Unsere Mission',
    mission_text: 'Nahtlose Konnektivität für Reisende bereitzustellen und sicherzustellen, dass sie mit Familie und Freunden kommunizieren, auf das Internet zugreifen und sich auf der ganzen Welt ohne Probleme zurechtfinden können. Wir verstehen die Bedeutung der Verbindung in diesen Tagen und sind bestrebt, Reisenden, die verschiedene Länder besuchen, eine zuverlässige und effiziente digitale Lösung ohne Kommunikationsbarrieren anzubieten.',
    vision_title: 'Unsere Vision',
    vision_text: 'Ein seriöser Reise-eSIM-Anbieter weltweit zu sein. Wir arbeiten hart daran, unseren Kunden immer genauere und zuverlässigere Produkte und das bestmögliche Kundenerlebnis zu bieten.',
    why_title: 'Warum Uns Wählen?',
    why_no_remove: 'Keine Notwendigkeit, SIM-Karte zu entfernen',
    why_no_remove_desc: 'Unsere eSIMs ermöglichen es Ihnen, Anrufe zu tätigen, Textnachrichten zu senden und auf das Internet zuzugreifen, wie Sie es mit einer physischen SIM-Karte tun würden, ohne das SIM-Kartenfach zu öffnen.',
    why_various: 'Verschiedene Datenpläne',
    why_various_desc: 'Wir verstehen, dass jeder Reisende einzigartige Bedürfnisse und Vorlieben hat. Daher bieten wir eine breite Palette von eSIM-Datenplänen zur Auswahl, je nach Ihren spezifischen Bedürfnissen.',
    why_digital: '100% digital und einfach zu verwenden',
    why_digital_desc: 'Unsere eSIMs können online gekauft werden, wo und wann immer Sie sind, vor Ihrer Reise. Nach der Ankunft am Zielort werden die eSIMs automatisch aktiviert, wenn sie mit einem unterstützten Netzwerk verbunden sind, und Sie können sofort mit der Nutzung beginnen.',
    why_saving: 'Geld sparen',
    why_saving_desc: 'Unsere Pläne sind wettbewerbsfähig, wir bemühen uns, unseren Kunden das beste Preis-Leistungs-Verhältnis zu bieten. Bei Verwendung unserer eSIMs zu echten lokalen Tarifen, alle im Voraus bezahlt, müssen Sie sich keine Sorgen über internationale Roaming-Gebühren machen.',
    why_support: '24/7 mehrsprachiger Kundensupport',
    why_support_desc: 'Wir bieten 365 Tage im Jahr 24/7 Kundensupport in verschiedenen Sprachen wie Englisch, Vietnamesisch, Chinesisch, Japanisch, Spanisch, damit Sie sich jederzeit an uns wenden können, wenn Sie Fragen oder Bedenken haben.',
    values_title: 'Unsere Kernwerte',
    value_customer: 'Kundenorientiert',
    value_customer_desc: 'Wir erkannten, dass Kunden der Grund für unseren Geschäftserfolg sind. Wir konzentrieren uns darauf, unseren Kunden sowohl am Verkaufspunkt als auch nach dem Verkauf ein positives Kundenerlebnis zu bieten, um Wettbewerbsvorteile zu erlangen.',
    value_reliability: 'Zuverlässigkeit',
    value_reliability_desc: 'Wir arbeiten auf Flatrate-Basis, im Voraus bezahlt, sodass Sie nie mit einer unangenehmen Überraschung konfrontiert werden. Wir streben langfristige Beziehungen zu unseren Kunden, Partnern, Lieferanten und Mitarbeitern an, daher sind Transparenz und Ehrlichkeit wesentliche Werte für uns.',
    value_integrity: 'Integrität',
    value_integrity_desc: 'Transparenz und offene Kommunikation sind notwendig, um dauerhafte Beziehungen aufzubauen. In all unseren Beziehungen, ob mit Kunden, Lieferanten, Partnern oder unseren eigenen Mitarbeitern, zielen wir darauf ab, Vertrauen und Transparenz durch verantwortungsvolle Handlungen aufzubauen.',
    value_innovation: 'Innovation',
    value_innovation_desc: 'Jeden Tag ein bisschen besser. Wir machen die Dinge anders und versuchen, neue Dienste zu aktualisieren und zu entwickeln, um unseren Kunden eine noch bessere Konnektivität zu bieten, egal wo sie sich befinden.',
    international_title: 'Wir sind Internationaler eSIM-Anbieter',
    international_text: 'hello esims ist ein internationaler eSIM-Anbieter, der Dienstleistungen für eine Vielzahl von Ländern anbietet, einschließlich solcher in Asien, Europa, Ozeanien und Afrika usw. hello esims bietet eine praktische Lösung für Reisende, die den Ärger mit physischen SIM-Karten und Roaming-Gebühren vermeiden möchten. Mit globaler Abdeckung und benutzerfreundlicher Plattform ist hello esims eine ausgezeichnete Option für Vielflieger und digitale Nomaden, die ein nahtloses eSIM-Erlebnis suchen.',
    leadership_title: 'Unser Führungsteam',
    team_ceo: 'CEO / Gründer',
    team_coo: 'Chief Operating Officer / Mitbegründer',
    team_cos: 'Chief of Staff / Mitbegründer',
    team_cto: 'Chief Technology Officer',
    convinced_title: 'Überzeugt?',
    convinced_text: 'Möchten Sie mehr über eSIM erfahren?',
    contact_us: 'Kontaktieren Sie Uns',
    back_to_home: 'Zurück zur Startseite',
  },
}

export default function AboutUsPage({ params }: { params: Promise<{ lng: string }> }) {
  const [lng, setLng] = useState<string>('en')

  // 使用 useEffect 解析 params
  useEffect(() => {
    let isMounted = true
    params.then(p => {
      if (isMounted) {
        setLng(p.lng)
      }
    })
    return () => {
      isMounted = false
    }
  }, [params])

  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* 标题和介绍 */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            {t('subtitle')}
          </h2>
          <p className="text-xl font-medium text-blue-600 mb-6">
            {t('tagline')}
          </p>
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">
            {t('description')}
          </p>
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">
            {t('description2')}
          </p>
          <p className="text-lg font-semibold text-gray-800 mt-6">
            {t('guarantee')}
          </p>
        </section>

        {/* eSIM 特性 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('features_title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature_online')}
              </h3>
              <p className="text-gray-600">
                {t('feature_online_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature_coverage')}
              </h3>
              <p className="text-gray-600">
                {t('feature_coverage_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature_easy')}
              </h3>
              <p className="text-gray-600">
                {t('feature_easy_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* 使命和愿景 */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('mission_title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('mission_text')}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('vision_title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('vision_text')}
            </p>
          </div>
        </section>

        {/* 为什么选择我们 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('why_title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_no_remove')}
              </h3>
              <p className="text-gray-600">
                {t('why_no_remove_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_various')}
              </h3>
              <p className="text-gray-600">
                {t('why_various_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_digital')}
              </h3>
              <p className="text-gray-600">
                {t('why_digital_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_saving')}
              </h3>
              <p className="text-gray-600">
                {t('why_saving_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_support')}
              </h3>
              <p className="text-gray-600">
                {t('why_support_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* 核心价值观 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('values_title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('value_customer')}
              </h3>
              <p className="text-gray-600">
                {t('value_customer_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('value_reliability')}
              </h3>
              <p className="text-gray-600">
                {t('value_reliability_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('value_integrity')}
              </h3>
              <p className="text-gray-600">
                {t('value_integrity_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('value_innovation')}
              </h3>
              <p className="text-gray-600">
                {t('value_innovation_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* 国际 eSIM 提供商 */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('international_title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('international_text')}
          </p>
        </section>

        {/* 领导团队 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('leadership_title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {lng === 'zh' ? '张先生' : lng === 'vi' ? 'Ông Trương' : lng === 'de' ? 'Herr Zhang' : 'Mr. Zhang'}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('team_ceo')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {lng === 'zh' ? '李女士' : lng === 'vi' ? 'Bà Lý' : lng === 'de' ? 'Frau Li' : 'Ms. Li'}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('team_coo')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {lng === 'zh' ? '王先生' : lng === 'vi' ? 'Ông Vương' : lng === 'de' ? 'Herr Wang' : 'Mr. Wang'}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('team_cos')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {lng === 'zh' ? '刘先生' : lng === 'vi' ? 'Ông Lưu' : lng === 'de' ? 'Herr Liu' : 'Mr. Liu'}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('team_cto')}
              </p>
            </div>
          </div>
        </section>

        {/* 联系我们 */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('convinced_title')}
          </h2>
          <p className="text-xl mb-6">
            {t('convinced_text')}
          </p>
          <Link
            href={`/${lng}`}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('contact_us')}
          </Link>
        </section>
      </div>
    </main>
  )
}

