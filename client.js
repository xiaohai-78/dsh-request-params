window.__ModuleLoader__.load({
  id: 'dsh-request-params',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'dsh-request-params'
    const ROUTE = '/api/dsh-request-params'
    /** The sidebar entry and the central panel it opens share this id. */
    const PANEL_ID = 'dsh-request-params'
    const NOTICE_MS = 6000
    /** Where the page keeps what is selected and open, an unsaved draft, and the trial request while the person visits another page. */
    const VIEW_KEY = 'dsh-request-params.view'
    const DRAFT_KEY = 'dsh-request-params.draft'
    const TRY_KEY = 'dsh-request-params.try'
    /** How many requests a channel's page lists before linking to the full log. */
    const CHANNEL_RECENT = 5

    const ZH = {
      'nav': '请求参数',
      'title': '请求参数',
      'intro': '给发往模型的请求加上你需要的参数：OpenRouter 供应商路由、思考强度、额外字段和请求头',
      'refresh': '刷新',
      'retry': '重试',
      'dismiss': '关闭',
      'close': '关闭',
      'cancel': '取消',
      'add': '添加',
      'undo': '撤销',
      'more': '更多操作',
      'notSet': '不设置',
      'loadFailed': '加载失败：{reason}',
      'saved': '已保存，下一个模型请求起生效',
      'draftRestored': '已恢复上次没保存的修改',
      'changedElsewhere': '规则文件在别处被修改，已载入最新版',
      'listSeparator': '、',
      'removeItem': '移除 {item}',
      'moveUpItem': '上移 {item}',
      'moveDownItem': '下移 {item}',
      'badNumber': '请输入不小于 0 的数字',
      'badInteger': '请输入不小于 0 的整数',
      'jsonInvalid': 'JSON 格式不对：{reason}',
      'jsonNeedsObject': '需要一个 JSON 对象，例如 { "key": "value" }',
      'master.on': '运行中',
      'master.off': '已暂停',
      'master.pause': '暂停所有参数',
      'master.resume': '恢复所有参数',
      'master.pausedDone': '已暂停：现在不会修改任何请求',
      'master.resumed': '已恢复：从下一个请求起生效',
      'status.paused': '已暂停，不会修改任何请求',
      'status.noRules': '还没有生效的参数',
      'status.active': '{n} 项参数生效中',
      'status.active.one': '1 项参数生效中',
      'status.last': '最近一次请求 {ago}，{result}',
      'status.lastApplied': '加上了 {n} 项修改',
      'status.lastApplied.one': '加上了 1 项修改',
      'status.lastPaused': '因暂停没有修改',
      'status.lastPlain': '没有参数作用于它',
      'import.button': '导入…',
      'export.button': '导出',
      'help.button': '说明',
      'nav.label': '页面',
      'nav.channels': '渠道',
      'nav.other': '其他地址',
      'nav.tools': '查看',
      'nav.requests': '请求记录',
      'nav.try': '试运行',
      'nav.params': '{n} 项参数生效',
      'nav.params.one': '1 项参数生效',
      'nav.lastOk': '最近一次请求成功',
      'nav.lastFailed': '最近一次请求失败',
      'channels.loading': '正在读取渠道…',
      'channels.failed': '读取渠道失败：{reason}',
      'channels.unavailable': '这个 dsh 没有提供渠道列表',
      'channels.none': '还没有配置模型渠道',
      'channels.noHost': '还不知道这个渠道发往哪个地址。先在 dsh 里用它发一条消息，再回到这里。',
      'channels.models': '{n} 个模型',
      'channels.models.one': '1 个模型',
      'channels.source.settings': '地址来自渠道设置',
      'channels.source.default': '默认地址',
      'channels.source.environment': '地址来自环境变量',
      'channels.source.seen': '地址从请求得知',
      'channels.source.unknown': '地址未知',
      'channels.modelsError': '模型列表没读到：{reason}',
      'detail.add': '添加参数',
      'detail.emptyTitle': '这个渠道还没有额外参数',
      'detail.emptyBody': '请求现在按 dsh 默认的样子发出。选一项加上：',
      'detail.otherIntro': '不属于任何已配置渠道的参数，每一项自己写明作用于哪些主机、路径和模型。',
      'detail.otherEmpty': '需要给别的网关或自建服务加参数时，从这里开始：',
      'detail.recent': '最近请求',
      'detail.allRequests': '全部请求记录',
      'detail.recentEmpty': '还没有经过这个渠道的请求。在 dsh 里用它发一条消息，结果会出现在这里。',
      'preview.title': '发送时加上',
      'preview.model': '模型',
      'preview.loading': '正在计算…',
      'preview.none': '不加任何内容，请求原样发出',
      'preview.noneForModel': '没有参数作用于这个模型，请求原样发出',
      'preview.headers': '请求头',
      'preview.remove': '发出前删除（请求里有的话）：{fields}',
      'preview.paused': '全部参数已暂停，现在不会加上这些内容',
      'preview.unsaved': '含未保存的修改',
      'preview.failed': '预览失败：{reason}',
      'add.recipes': '常见网关的示例',
      'add.openrouter': 'OpenRouter',
      'preset.openrouter-routing.name': '供应商路由',
      'preset.openrouter-routing.desc': '指定走哪些供应商、顺序、数据政策，以及备用模型',
      'preset.reasoning.name': '思考强度',
      'preset.reasoning.desc': '设置 reasoning 的强度或预算，或不返回思考内容',
      'preset.sampling.name': '采样参数',
      'preset.sampling.desc': 'top_k、min_p、top_a、repetition_penalty',
      'preset.session.name': '会话粘性',
      'preset.session.desc': '带上会话 ID，同一场对话走同一个供应商，更容易命中缓存',
      'preset.attribution.name': '应用署名',
      'preset.attribution.desc': '用 HTTP-Referer 和标题把流量记到你的应用名下',
      'preset.strip.name': '删除字段',
      'preset.strip.desc': '网关不认某些字段（比如 store）时，发出前去掉',
      'preset.custom.name': '自定义字段和请求头',
      'preset.custom.desc': '自己写 JSON 字段和请求头，适用于任何网关',
      'recipe.vllm-thinking.name': 'vLLM / Qwen3：关闭思考',
      'recipe.vllm-thinking.desc': '传 chat_template_kwargs，让 Qwen3 这类模型不思考',
      'recipe.helicone.name': 'Helicone 观测',
      'recipe.helicone.desc': '带上 Helicone 的认证、会话和自定义属性请求头，密钥读环境变量 HELICONE_API_KEY',
      'recipe.cloudflare.name': 'Cloudflare AI Gateway 缓存',
      'recipe.cloudflare.desc': '设置网关缓存时长，并用会话 ID 给请求打标签',
      'recipe.openai-cache.name': 'OpenAI 提示缓存键',
      'recipe.openai-cache.desc': '用会话 ID 作 prompt_cache_key，同一场对话更容易命中缓存',
      'card.unnamed': '未命名',
      'card.allModels': '全部模型',
      'card.scope': '适用的模型',
      'card.scopeHint': '留空 = 全部模型。可以用通配符，例如 deepseek/*',
      'card.notForModel': '不作用于正在预览的模型',
      'card.alsoFor': '这一项也作用于：{names}',
      'card.everywhere': '这一项作用于所有地址',
      'card.enable': '启用「{name}」',
      'card.disable': '停用「{name}」',
      'card.problems': '{n} 个问题',
      'card.problems.one': '1 个问题',
      'card.rename': '重命名',
      'card.name': '名称',
      'card.editMatch': '编辑主机和路径',
      'card.addNote': '添加备注',
      'card.note': '备注',
      'card.notePlaceholder': '写给以后的自己：为什么要这一项',
      'card.duplicate': '复制',
      'card.moveUp': '上移',
      'card.moveDown': '下移',
      'card.editJson': '改为直接编辑 JSON',
      'card.confirmJson': '改成直接编辑 JSON 后，这一项不再有表单，只能改 JSON。继续吗？',
      'card.delete': '删除',
      'card.deleted': '已删除「{name}」',
      'card.copyName': '{name}（副本）',
      'card.order': '同一个请求用到多项参数时，按从上到下的顺序应用，后面的能看到前面的结果。',
      'limit.rules': '最多 {n} 项参数',
      'sum.empty': '还没有设置',
      'sum.strict': '只用这些',
      'sum.only': '只在 {list} 里挑',
      'sum.ignore': '不用 {list}',
      'sum.sort.price': '价格优先',
      'sum.sort.throughput': '吞吐优先',
      'sum.sort.latency': '延迟优先',
      'sum.zdr': '零数据留存',
      'sum.deny': '拒绝数据收集',
      'sum.fallbackModels': '{n} 个备用模型',
      'sum.fallbackModels.one': '1 个备用模型',
      'sum.limits': '{n} 个其他条件',
      'sum.limits.one': '1 个其他条件',
      'sum.effort': '强度 {effort}',
      'sum.budget': '预算 {n} tokens',
      'sum.exclude': '不返回思考',
      'match.title': '适用于',
      'match.hosts': '主机',
      'match.hostsHint': '请求发往这些主机才生效，例如 openrouter.ai 或 *.example.com（*.x 也包含 x 本身）。不写端口就匹配任何端口',
      'match.models': '模型',
      'match.modelsHint': '留空 = 所有模型。可以用通配符：deepseek/*、*-chat',
      'match.paths': '路径',
      'match.pathsHint': '留空 = 只作用于模型接口（…/chat/completions、…/messages、…/responses）。写了路径就按前缀匹配，也能用在别的接口上',
      'match.fromChannel': '从渠道填入…',
      'route.providers': '供应商',
      'route.providersHint': '按顺序尝试。不填时由 OpenRouter 自己挑（默认按价格均衡）',
      'route.search': '搜索供应商，或输入 slug（如 deepinfra/fp4）',
      'route.others': '其他供应商',
      'route.othersAllow': '可以换用',
      'route.othersDeny': '不使用',
      'route.othersHint': '选「不使用」时，上面的供应商都不可用就直接报错，不会换到别家',
      'route.ignore': '排除',
      'route.ignoreSearch': '添加不想用的供应商',
      'route.sort': '排序',
      'route.sortDefault': '默认',
      'route.sortPrice': '价格',
      'route.sortThroughput': '吞吐量',
      'route.sortLatency': '延迟',
      'route.data': '数据',
      'route.zdr': '只用零数据留存（ZDR）的供应商',
      'route.zdrHint': '供应商不保留你的提示和回答',
      'route.deny': '不用会存储请求数据的供应商',
      'route.denyHint': '对应 data_collection: deny',
      'route.models': '备用模型',
      'route.modelsHint': '主模型不可用时，按顺序换用这些模型',
      'route.more': '更多条件',
      'route.less': '收起更多条件',
      'route.only': '白名单',
      'route.onlyHint': '只在这些供应商里挑选，不分先后',
      'route.onlySearch': '添加允许的供应商',
      'route.require': '参数支持',
      'route.requireLabel': '只用支持请求里全部参数的供应商',
      'route.requireHint': '否则不支持的参数会被悄悄忽略',
      'route.quant': '量化精度',
      'route.quantHint': '只用这些精度的端点；一个都不选 = 不限',
      'route.maxPrice': '价格上限',
      'route.input': '输入',
      'route.output': '输出',
      'route.perMillion': '美元 / 百万 token',
      'route.speed': '速度偏好',
      'route.minThroughput': '最低吞吐',
      'route.maxLatency': '最高延迟',
      'route.perfHint': '只是偏好：达标的优先，不会因此拒绝请求',
      'route.seconds': '秒',
      'route.distill': '蒸馏',
      'route.distillable': '只用允许蒸馏文本的模型',
      'route.bundled': '没连上 OpenRouter，用的是内置的供应商列表（{date}）',
      'route.notServing': '不提供该模型',
      'route.notServingTitle': '按 OpenRouter 的目录，这个供应商目前不提供 {model}',
      'route.noneServe': '按 OpenRouter 的目录，这些供应商都不提供 {model}，又不允许换用其他供应商，这个模型的请求会失败（No endpoints found）。换一个模型预览，或改用提供它的供应商',
      'route.noneServeFallback': '按 OpenRouter 的目录，这些供应商都不提供 {model}，这个模型的请求会交给其他供应商',
      'route.noTraffic': '还没有看到发往 openrouter.ai 的请求。在 llm-pi-ai 里加上 openrouter 渠道后，这一项才会生效（见插件说明）',
      'picker.forModel': '提供 {model} 的供应商',
      'picker.all': '全部供应商',
      'picker.loading': '正在读取…',
      'picker.stale': '没连上 OpenRouter，显示的是缓存',
      'picker.useText': '使用「{text}」',
      'picker.none': '没有匹配的供应商',
      'picker.added': '已添加',
      'picker.priceTitle': '价格：输入 / 输出，美元每百万 token；可用率',
      'reasoning.effort': '强度',
      'reasoning.effortHint': 'xhigh 最深，none 关闭；模型不支持时 OpenRouter 会忽略',
      'reasoning.maxTokens': 'token 预算',
      'reasoning.maxTokensHint': '给支持预算的模型用，和强度二选一',
      'reasoning.output': '输出',
      'reasoning.exclude': '不返回思考内容',
      'reasoning.excludeHint': '模型仍会思考并计费，只是回答里不带思考过程',
      'sampling.topK': 'top_k',
      'sampling.topKHint': '只从概率最高的 K 个候选里选',
      'sampling.minP': 'min_p',
      'sampling.minPHint': '去掉概率低于「最高概率 × min_p」的候选',
      'sampling.topA': 'top_a',
      'sampling.topAHint': '按最高概率的平方动态收窄候选',
      'sampling.repetition': 'repetition_penalty',
      'sampling.repetitionHint': '大于 1 抑制重复，等于 1 不惩罚',
      'session.label': '带上',
      'session.body': '请求体字段 session_id',
      'session.bodyHint': '值是 {{session}}，即 dsh 的会话 ID',
      'session.header': '请求头 x-session-id',
      'session.headerHint': '同一个会话 ID，部分网关用它做缓存亲和',
      'attr.title': '应用名称',
      'attr.titleHint': '写入请求头 X-OpenRouter-Title',
      'attr.referer': '应用网址',
      'attr.refererHint': '写入请求头 HTTP-Referer',
      'strip.fields': '要删除的字段',
      'strip.common': '常见',
      'strip.hint': '嵌套字段用点号，如 stream_options.include_usage。messages、model 等核心字段不能在这里删',
      'custom.merge': '请求体字段',
      'custom.mergeHint': 'JSON 对象，每次都写进请求体；对象会和已有内容合并，其他类型直接替换',
      'custom.headers': '请求头',
      'custom.headersHint': '同名请求头会被替换；Authorization 等认证头不能改',
      'custom.more': '更多：缺省值、删除字段、删除请求头',
      'custom.less': '收起',
      'custom.defaults': '缺省值',
      'custom.defaultsHint': 'JSON 对象，只在请求里没有这个字段时才写入',
      'custom.remove': '删除字段',
      'custom.removeHint': '用点号写路径，例如 store、stream_options.include_usage。先删除，再写入',
      'custom.removeHeaders': '删除请求头',
      'custom.removeHeadersHint': '名称不区分大小写',
      'custom.templates': '值里可以写：{{model}} 当前模型 · {{session}} 会话 ID · {{env:名称}} 环境变量（密钥放这里，值不会显示在页面和请求记录里）',
      'custom.protected': '核心字段',
      'custom.protectedLabel': '允许改核心字段',
      'custom.protectedHint': '默认不能动 {fields}；打开后这一项可以改写它们，请确认你清楚后果',
      'headers.add': '添加请求头',
      'headers.name': '请求头名称',
      'headers.value': '请求头的值',
      'headers.valuePlaceholder': '值，可以写 {{env:KEY}}',
      'headers.remove': '删除请求头 {name}',
      'env.set': '环境变量 {name} 已设置',
      'env.unset': '环境变量 {name} 没有设置：用到它的字段会被跳过',
      'problem.no-host': '还没有填主机',
      'problem.bad-host': '主机写法不对：{detail}',
      'problem.too-large': '内容太大，超过上限',
      'problem.too-deep': '嵌套层数太多',
      'problem.bad-key': '不允许的字段名：{detail}',
      'problem.protected': '不能改核心字段 {detail}（在「自定义字段和请求头」里打开「允许改核心字段」）',
      'problem.template-env-name': '环境变量名不对：{detail}',
      'problem.template-unknown': '不认识的模板变量：{detail}（可用 model、session、env:名称）',
      'problem.bad-path': '删除路径不对：{detail}',
      'problem.bad-header': '请求头名称不对：{detail}',
      'problem.forbidden-header': '请求头 {detail} 不能改（认证和传输相关）',
      'problem.bad-header-value': '请求头 {detail} 的值不能换行',
      'problem.duplicate-header': '请求头 {detail} 写了两次',
      'invalid.rule': '「{rule}」作用于这个请求，但它有问题，没有应用：{problems}',
      'skipped.env-missing': '「{rule}」的 {field} 用到环境变量 {name}，它没有设置，这一项被跳过',
      'skipped.bad-value': '「{rule}」的请求头 {name} 的值里有换行，已跳过',
      'change.set': '设置',
      'change.default': '缺省值',
      'change.remove': '删除',
      'change.header': '请求头',
      'change.header-remove': '去掉请求头',
      'change.secret': '（来自环境变量，不显示）',
      'change.more': '还有 {n} 项',
      'req.intro': 'dsh 最近发出的模型请求，只放在内存里，重启后清空。请求出错时还会留下网关返回的前 2 KB 文字（可能引用请求内容）',
      'req.clear': '清空',
      'req.endpoints': '不属于任何渠道的接口',
      'req.count': '{n} 次',
      'req.count.one': '1 次',
      'req.makeRule': '为它添加参数',
      'req.emptyTitle': '还没有模型请求',
      'req.emptyHint': '发一条消息，请求就会出现在这里，并显示参数有没有加上、网关返回了什么',
      'req.noModel': '(没有模型名)',
      'req.applied': '加了 {n} 项',
      'req.noChange': '无需修改',
      'req.noMatch': '没有参数',
      'req.paused': '已暂停',
      'req.notApplied': '没能应用',
      'req.networkError': '连接失败',
      'req.aborted': '已取消',
      'req.matched': '生效的参数',
      'req.duration': '{ms} 毫秒',
      'req.failed': '没能应用参数，请求原样发出：{reason}',
      'req.networkDetail': '连接失败：{reason}',
      'req.errorText': '网关返回的内容',
      'req.rejectedHint': '网关拒绝了这条加过参数的请求。先看上面加了哪些字段、网关是否支持；也可以先暂停全部参数，确认是不是它们引起的',
      'req.pauseAll': '暂停全部参数',
      'req.mentions': '网关的报错里提到了参数设置的字段：{fields}。它们很可能就是被拒绝的原因',
      'try.intro': '用一个示例请求试试，不会真的发出去。只想看某个渠道会加什么，打开那个渠道看「发送时加上」就行',
      'try.url': '请求地址',
      'try.body': '请求体 (JSON)',
      'try.bodyHint': '只在这里处理，不会发送，也不会写进磁盘',
      'try.session': '会话 ID（可选）',
      'try.sessionHint': '用来看 {{session}} 会变成什么',
      'try.run': '试运行',
      'try.reset': '还原示例',
      'try.useDraft': '用未保存的修改',
      'try.paused': '全部参数已暂停，所以请求不会被修改',
      'try.notModelEndpoint': '这个地址看起来不是模型接口（…/chat/completions、…/messages、…/responses）。参数默认只作用于模型接口；要用在别的接口，请写上路径',
      'try.noMatch': '没有参数作用于这个请求。检查一下主机、模型和路径',
      'try.unchanged': '作用于它的参数没有改变请求（里面的值本来就有）',
      'try.resultBody': '处理后的请求体',
      'try.resultHeaders': '请求头的变化',
      'import.title': '导入',
      'import.hint': '粘贴导出的 JSON，或选一个文件。导入的内容先放进草稿，保存后才生效',
      'import.read': '读取',
      'import.file': '选择文件…',
      'import.found': '读到 {n} 项参数：',
      'import.found.one': '读到 1 项参数：',
      'import.problems': '其中 {n} 项有问题，修正后才能保存',
      'import.problems.one': '其中 1 项有问题，修正后才能保存',
      'import.unsaved': '导入之后还要点保存才会生效',
      'import.append': '追加到现有参数',
      'import.replace': '替换全部参数',
      'import.confirmReplace': '用导入的内容替换现有的全部参数？',
      'import.empty': '没有读到参数',
      'import.applied': '已导入到草稿，检查后点保存',
      'import.tooLarge': '文件太大（超过 2 MB）',
      'import.unreadable': '读不了这个文件',
      'help.title': '它是怎么工作的',
      'help.what': '在 dsh 把请求发给模型之前，按你的设置加上字段和请求头：OpenRouter 的供应商路由、reasoning、备用模型，或任何网关接受的 JSON 字段。',
      'help.how': '参数按渠道管理：选一个渠道、加上参数，「发送时加上」会立刻显示请求会多出什么，「最近请求」显示真实请求的结果。不属于任何渠道的地址放在「其他地址」，自己写明主机、路径和模型。官方 DeepSeek 接口，以及 llm-pi-ai 里的 OpenAI 兼容和 Anthropic 兼容渠道都适用。',
      'help.templates': '值里可以写 {{model}}（当前模型）、{{session}}（会话 ID）、{{env:名称}}（环境变量，适合放密钥，值不会显示）。',
      'help.safety': '为安全起见：messages、tools、model 等核心字段默认不能改，Authorization、x-api-key 等认证头永远不能改。参数出了问题，请求会原样发出，不会被拦住。',
      'help.privacy': '参数保存在本机配置目录的 .dsh-request-params/config.json。请求记录只在内存里，不写入磁盘；不保存对话内容，只有请求出错时会留下网关返回的前 2 KB 文字。页面上有供应商路由参数时，会读取 OpenRouter 公开的供应商和模型目录，不带任何密钥和内容。',
      'save.bar': '保存修改',
      'save.unsaved': '有未保存的修改',
      'save.hint': 'Ctrl/⌘ + S 保存',
      'save.save': '保存',
      'save.saving': '保存中…',
      'save.discard': '放弃',
      'save.confirmDiscard': '放弃所有未保存的修改？',
      'save.blocked': '{n} 项启用的参数有问题，修正后才能保存',
      'save.blocked.one': '1 项启用的参数有问题，修正后才能保存',
      'save.building': '正在生成…',
      'conflict.text': '规则文件在你编辑期间被别处改动了（另一个页面或手动修改）',
      'conflict.reload': '载入最新版（放弃我的修改）',
      'conflict.overwrite': '以我的修改为准',
      'damaged.title': '规则文件读不了，所以现在没有任何参数在生效',
      'damaged.detail': '{path}：{reason}',
      'damaged.reset': '移开并重新开始',
      'damaged.confirm': '把损坏的文件改名留作备份，然后从空白开始？',
      'damaged.done': '已把旧文件移到 {path}',
      'err.network': '连接不上 DSH，请稍后再试',
      'err.conflict': '规则文件已被修改，请重新载入',
      'err.config-damaged': '规则文件已损坏，请先处理它',
      'err.too-large': '内容太大了',
      'err.bad-url': '请输入完整网址，例如 https://openrouter.ai/api/v1/chat/completions',
      'err.offline': '连不上 OpenRouter，稍后再试',
      'err.bad-response': '收到了看不懂的回复',
      'err.bad-model': '模型 ID 要写成 作者/名称，例如 deepseek/deepseek-chat',
      'err.bad-request': '请求不对',
    }

    const EN = {
      'nav': 'Request Params',
      'title': 'Request Parameters',
      'intro': 'Add the parameters you need to model requests: OpenRouter provider routing, reasoning effort, extra fields, and headers',
      'refresh': 'Refresh',
      'retry': 'Retry',
      'dismiss': 'Dismiss',
      'close': 'Close',
      'cancel': 'Cancel',
      'add': 'Add',
      'undo': 'Undo',
      'more': 'More actions',
      'notSet': 'Not set',
      'loadFailed': 'Could not load: {reason}',
      'saved': 'Saved. It applies from the next model request',
      'draftRestored': 'Restored your unsaved changes',
      'changedElsewhere': 'The rules file changed elsewhere; loaded the latest',
      'listSeparator': ', ',
      'removeItem': 'Remove {item}',
      'moveUpItem': 'Move {item} up',
      'moveDownItem': 'Move {item} down',
      'badNumber': 'Enter a number, 0 or more',
      'badInteger': 'Enter a whole number, 0 or more',
      'jsonInvalid': 'Not valid JSON: {reason}',
      'jsonNeedsObject': 'Expected a JSON object such as { "key": "value" }',
      'master.on': 'Running',
      'master.off': 'Paused',
      'master.pause': 'Pause all parameters',
      'master.resume': 'Resume all parameters',
      'master.pausedDone': 'Paused: no request is changed now',
      'master.resumed': 'Resumed: applies from the next request',
      'status.paused': 'Paused, no request is changed',
      'status.noRules': 'No parameter is active yet',
      'status.active': '{n} parameters active',
      'status.active.one': '1 parameter active',
      'status.last': 'Last request {ago}: {result}',
      'status.lastApplied': 'added {n} changes',
      'status.lastApplied.one': 'added 1 change',
      'status.lastPaused': 'unchanged while paused',
      'status.lastPlain': 'no parameter applied',
      'import.button': 'Import…',
      'export.button': 'Export',
      'help.button': 'Help',
      'nav.label': 'Pages',
      'nav.channels': 'Channels',
      'nav.other': 'Other addresses',
      'nav.tools': 'Inspect',
      'nav.requests': 'Request log',
      'nav.try': 'Try it',
      'nav.params': '{n} parameters active',
      'nav.params.one': '1 parameter active',
      'nav.lastOk': 'The last request succeeded',
      'nav.lastFailed': 'The last request failed',
      'channels.loading': 'Reading channels…',
      'channels.failed': 'Could not read the channels: {reason}',
      'channels.unavailable': 'This dsh does not list its channels',
      'channels.none': 'No model channel is configured yet',
      'channels.noHost': 'The address of this channel is not known yet. Send a message through it in dsh, then come back.',
      'channels.models': '{n} models',
      'channels.models.one': '1 model',
      'channels.source.settings': 'Address from the channel settings',
      'channels.source.default': 'Default address',
      'channels.source.environment': 'Address from the environment',
      'channels.source.seen': 'Address learned from requests',
      'channels.source.unknown': 'Address unknown',
      'channels.modelsError': 'Could not list the models: {reason}',
      'detail.add': 'Add parameter',
      'detail.emptyTitle': 'No extra parameters on this channel',
      'detail.emptyBody': 'Requests go out the way dsh builds them. Pick one to add:',
      'detail.otherIntro': 'Parameters for addresses that are not a configured channel. Each one names the hosts, paths, and models it applies to.',
      'detail.otherEmpty': 'To add parameters for another gateway or your own server, start here:',
      'detail.recent': 'Recent requests',
      'detail.allRequests': 'Full request log',
      'detail.recentEmpty': 'No request has gone through this channel yet. Send a message with it in dsh and the result shows up here.',
      'preview.title': 'Added when sending',
      'preview.model': 'Model',
      'preview.loading': 'Working it out…',
      'preview.none': 'Nothing is added; the request goes out unchanged',
      'preview.noneForModel': 'No parameter applies to this model; the request goes out unchanged',
      'preview.headers': 'Headers',
      'preview.remove': 'Removed before sending (if present): {fields}',
      'preview.paused': 'All parameters are paused, so none of this is added right now',
      'preview.unsaved': 'includes unsaved changes',
      'preview.failed': 'Preview failed: {reason}',
      'add.recipes': 'Examples for common gateways',
      'add.openrouter': 'OpenRouter',
      'preset.openrouter-routing.name': 'Provider routing',
      'preset.openrouter-routing.desc': 'Choose providers and their order, data policy, and fallback models',
      'preset.reasoning.name': 'Reasoning effort',
      'preset.reasoning.desc': 'Set reasoning effort or budget, or leave the reasoning out of the reply',
      'preset.sampling.name': 'Sampling extras',
      'preset.sampling.desc': 'top_k, min_p, top_a, repetition_penalty',
      'preset.session.name': 'Session stickiness',
      'preset.session.desc': 'Send the session ID so one conversation sticks to one provider and caches better',
      'preset.attribution.name': 'App attribution',
      'preset.attribution.desc': 'Credit traffic to your app with HTTP-Referer and a title',
      'preset.strip.name': 'Remove fields',
      'preset.strip.desc': 'Drop fields a gateway rejects (such as store) before sending',
      'preset.custom.name': 'Custom fields and headers',
      'preset.custom.desc': 'Write JSON fields and headers yourself; works with any gateway',
      'recipe.vllm-thinking.name': 'vLLM / Qwen3: thinking off',
      'recipe.vllm-thinking.desc': 'Pass chat_template_kwargs so models such as Qwen3 skip thinking',
      'recipe.helicone.name': 'Helicone observability',
      'recipe.helicone.desc': 'Send Helicone auth, session, and property headers; the key comes from HELICONE_API_KEY',
      'recipe.cloudflare.name': 'Cloudflare AI Gateway cache',
      'recipe.cloudflare.desc': 'Set the gateway cache lifetime and tag requests with the session ID',
      'recipe.openai-cache.name': 'OpenAI prompt cache key',
      'recipe.openai-cache.desc': 'Use the session ID as prompt_cache_key so one conversation hits the cache more often',
      'card.unnamed': 'Untitled',
      'card.allModels': 'All models',
      'card.scope': 'Models',
      'card.scopeHint': 'Empty = every model. Wildcards work, such as deepseek/*',
      'card.notForModel': 'Does not apply to the model in the preview',
      'card.alsoFor': 'This also applies to: {names}',
      'card.everywhere': 'This applies to every address',
      'card.enable': 'Turn on "{name}"',
      'card.disable': 'Turn off "{name}"',
      'card.problems': '{n} problems',
      'card.problems.one': '1 problem',
      'card.rename': 'Rename',
      'card.name': 'Name',
      'card.editMatch': 'Edit hosts and paths',
      'card.addNote': 'Add a note',
      'card.note': 'Note',
      'card.notePlaceholder': 'For future you: why this exists',
      'card.duplicate': 'Duplicate',
      'card.moveUp': 'Move up',
      'card.moveDown': 'Move down',
      'card.editJson': 'Edit as JSON instead',
      'card.confirmJson': 'After this the form is gone and the parameter can only be changed as JSON. Continue?',
      'card.delete': 'Delete',
      'card.deleted': 'Deleted "{name}"',
      'card.copyName': '{name} (copy)',
      'card.order': 'When several parameters apply to one request they apply from top to bottom, and a later one sees what the earlier ones did.',
      'limit.rules': 'At most {n} parameters',
      'sum.empty': 'nothing set yet',
      'sum.strict': 'only these',
      'sum.only': 'only from {list}',
      'sum.ignore': 'never {list}',
      'sum.sort.price': 'cheapest first',
      'sum.sort.throughput': 'fastest first',
      'sum.sort.latency': 'lowest latency first',
      'sum.zdr': 'zero data retention',
      'sum.deny': 'no data collection',
      'sum.fallbackModels': '{n} fallback models',
      'sum.fallbackModels.one': '1 fallback model',
      'sum.limits': '{n} more conditions',
      'sum.limits.one': '1 more condition',
      'sum.effort': 'effort {effort}',
      'sum.budget': 'budget {n} tokens',
      'sum.exclude': 'reasoning left out',
      'match.title': 'Applies to',
      'match.hosts': 'Hosts',
      'match.hostsHint': 'Only requests sent to these hosts, such as openrouter.ai or *.example.com (*.x also covers x itself). Without a port, any port matches',
      'match.models': 'Models',
      'match.modelsHint': 'Empty = every model. Wildcards work: deepseek/*, *-chat',
      'match.paths': 'Paths',
      'match.pathsHint': 'Empty = model endpoints only (…/chat/completions, …/messages, …/responses). A path matches by prefix and also reaches other endpoints',
      'match.fromChannel': 'Fill in from a channel…',
      'route.providers': 'Providers',
      'route.providersHint': 'Tried in this order. Leave it empty and OpenRouter picks (load balanced by price by default)',
      'route.search': 'Search providers, or type a slug (such as deepinfra/fp4)',
      'route.others': 'Other providers',
      'route.othersAllow': 'May be used',
      'route.othersDeny': 'Never',
      'route.othersHint': 'With Never, the request fails when none of the providers above can serve it instead of moving elsewhere',
      'route.ignore': 'Exclude',
      'route.ignoreSearch': 'Add a provider to avoid',
      'route.sort': 'Sort by',
      'route.sortDefault': 'Default',
      'route.sortPrice': 'Price',
      'route.sortThroughput': 'Throughput',
      'route.sortLatency': 'Latency',
      'route.data': 'Data',
      'route.zdr': 'Only zero data retention (ZDR) providers',
      'route.zdrHint': 'The provider keeps neither your prompt nor the answer',
      'route.deny': 'Skip providers that store request data',
      'route.denyHint': 'Sends data_collection: deny',
      'route.models': 'Fallback models',
      'route.modelsHint': 'If the main model is unavailable, these are tried in order',
      'route.more': 'More conditions',
      'route.less': 'Fewer conditions',
      'route.only': 'Allow list',
      'route.onlyHint': 'Pick only among these providers, in no particular order',
      'route.onlySearch': 'Add an allowed provider',
      'route.require': 'Parameters',
      'route.requireLabel': 'Only providers that support every parameter in the request',
      'route.requireHint': 'Otherwise unsupported parameters are quietly ignored',
      'route.quant': 'Quantization',
      'route.quantHint': 'Only endpoints at these precisions; none selected = any',
      'route.maxPrice': 'Price cap',
      'route.input': 'Input',
      'route.output': 'Output',
      'route.perMillion': 'USD per million tokens',
      'route.speed': 'Speed',
      'route.minThroughput': 'Minimum throughput',
      'route.maxLatency': 'Maximum latency',
      'route.perfHint': 'A preference only: providers that meet it go first, nothing is refused because of it',
      'route.seconds': 'seconds',
      'route.distill': 'Distillation',
      'route.distillable': 'Only models that allow distilling text',
      'route.bundled': 'OpenRouter could not be reached; showing the built-in provider list ({date})',
      'route.notServing': 'does not serve this model',
      'route.notServingTitle': 'In the OpenRouter catalog this provider does not serve {model} right now',
      'route.noneServe': 'In the OpenRouter catalog none of these providers serves {model}, and other providers are not allowed, so requests for this model will fail (No endpoints found). Preview another model, or pick a provider that serves it',
      'route.noneServeFallback': 'In the OpenRouter catalog none of these providers serves {model}, so requests for this model go to other providers',
      'route.noTraffic': 'No request to openrouter.ai has been seen yet. This works once an openrouter channel exists in llm-pi-ai (see the plugin README)',
      'picker.forModel': 'Providers serving {model}',
      'picker.all': 'All providers',
      'picker.loading': 'Loading…',
      'picker.stale': 'OpenRouter could not be reached; showing a cached answer',
      'picker.useText': 'Use "{text}"',
      'picker.none': 'No provider matches',
      'picker.added': 'added',
      'picker.priceTitle': 'Price: input / output, USD per million tokens; uptime',
      'reasoning.effort': 'Effort',
      'reasoning.effortHint': 'xhigh thinks the most, none turns it off; OpenRouter ignores it for models without reasoning',
      'reasoning.maxTokens': 'Token budget',
      'reasoning.maxTokensHint': 'For models that take a budget; use this or the effort, not both',
      'reasoning.output': 'Output',
      'reasoning.exclude': 'Leave the reasoning out of the reply',
      'reasoning.excludeHint': 'The model still reasons and you still pay for it; the answer just does not carry it',
      'sampling.topK': 'top_k',
      'sampling.topKHint': 'Pick only among the K most likely tokens',
      'sampling.minP': 'min_p',
      'sampling.minPHint': 'Drop tokens less likely than min_p × the top token',
      'sampling.topA': 'top_a',
      'sampling.topAHint': 'Narrows candidates using the square of the top probability',
      'sampling.repetition': 'repetition_penalty',
      'sampling.repetitionHint': 'Above 1 discourages repeats; 1 means no penalty',
      'session.label': 'Send',
      'session.body': 'Body field session_id',
      'session.bodyHint': 'The value is {{session}}, the dsh session ID',
      'session.header': 'Header x-session-id',
      'session.headerHint': 'The same session ID; some gateways use it for cache affinity',
      'attr.title': 'App name',
      'attr.titleHint': 'Sent as the X-OpenRouter-Title header',
      'attr.referer': 'App URL',
      'attr.refererHint': 'Sent as the HTTP-Referer header',
      'strip.fields': 'Fields to remove',
      'strip.common': 'Common',
      'strip.hint': 'Use dots for nested fields, like stream_options.include_usage. Core fields such as messages and model cannot be removed here',
      'custom.merge': 'Body fields',
      'custom.mergeHint': 'A JSON object written to the body every time; objects merge with what is there, anything else is replaced',
      'custom.headers': 'Headers',
      'custom.headersHint': 'A header with the same name is replaced; Authorization and other credentials cannot be changed',
      'custom.more': 'More: defaults, removed fields, removed headers',
      'custom.less': 'Less',
      'custom.defaults': 'Defaults',
      'custom.defaultsHint': 'A JSON object written only for fields the request does not have',
      'custom.remove': 'Remove fields',
      'custom.removeHint': 'Dotted paths, such as store or stream_options.include_usage. Removed first, then written',
      'custom.removeHeaders': 'Remove headers',
      'custom.removeHeadersHint': 'Names are not case sensitive',
      'custom.templates': 'Values may use: {{model}} the model · {{session}} the session ID · {{env:NAME}} an environment variable (put keys here; the value is never shown on this page or in the request log)',
      'custom.protected': 'Core fields',
      'custom.protectedLabel': 'Allow changing core fields',
      'custom.protectedHint': 'By default {fields} cannot be touched; with this on, this parameter may rewrite them, so be sure you know what it does',
      'headers.add': 'Add a header',
      'headers.name': 'Header name',
      'headers.value': 'Header value',
      'headers.valuePlaceholder': 'Value, may use {{env:KEY}}',
      'headers.remove': 'Remove header {name}',
      'env.set': 'Environment variable {name} is set',
      'env.unset': 'Environment variable {name} is not set: fields that use it are skipped',
      'problem.no-host': 'No host yet',
      'problem.bad-host': 'Not a valid host: {detail}',
      'problem.too-large': 'Too large',
      'problem.too-deep': 'Nested too deeply',
      'problem.bad-key': 'Field name not allowed: {detail}',
      'problem.protected': 'Core field {detail} cannot be changed (turn on "Allow changing core fields" in custom fields and headers)',
      'problem.template-env-name': 'Not a valid environment variable name: {detail}',
      'problem.template-unknown': 'Unknown template variable: {detail} (use model, session, or env:NAME)',
      'problem.bad-path': 'Not a valid path to remove: {detail}',
      'problem.bad-header': 'Not a valid header name: {detail}',
      'problem.forbidden-header': 'The header {detail} cannot be changed (credentials and transport)',
      'problem.bad-header-value': 'The value of header {detail} cannot contain a line break',
      'problem.duplicate-header': 'The header {detail} appears twice',
      'invalid.rule': '"{rule}" applies to this request but has problems, so it was not applied: {problems}',
      'skipped.env-missing': 'In "{rule}", {field} uses the environment variable {name}, which is not set, so it was skipped',
      'skipped.bad-value': 'In "{rule}", the value of header {name} has a line break, so it was skipped',
      'change.set': 'Set',
      'change.default': 'Default',
      'change.remove': 'Remove',
      'change.header': 'Header',
      'change.header-remove': 'Remove header',
      'change.secret': '(from an environment variable, not shown)',
      'change.more': '{n} more',
      'req.intro': 'The model requests dsh sent recently, kept in memory only and cleared on restart. When a request fails it also keeps the first 2 KB of what the gateway answered (which may quote the request)',
      'req.clear': 'Clear',
      'req.endpoints': 'Endpoints outside every channel',
      'req.count': '{n} requests',
      'req.count.one': '1 request',
      'req.makeRule': 'Add parameters',
      'req.emptyTitle': 'No model requests yet',
      'req.emptyHint': 'Send a message and the request shows up here, with what was added and what the gateway answered',
      'req.noModel': '(no model name)',
      'req.applied': 'added {n}',
      'req.noChange': 'nothing to change',
      'req.noMatch': 'no parameters',
      'req.paused': 'paused',
      'req.notApplied': 'not applied',
      'req.networkError': 'failed',
      'req.aborted': 'cancelled',
      'req.matched': 'Applied parameters',
      'req.duration': '{ms} ms',
      'req.failed': 'The parameters could not be applied, so the request went out unchanged: {reason}',
      'req.networkDetail': 'The connection failed: {reason}',
      'req.errorText': 'What the gateway answered',
      'req.rejectedHint': 'The gateway rejected this request after parameters were added. Check the fields above and whether the gateway supports them; or pause all parameters to see if they are the cause',
      'req.pauseAll': 'Pause all parameters',
      'req.mentions': 'The error text mentions fields a parameter set: {fields}. They are the likely reason for the refusal',
      'try.intro': 'Try a sample request; nothing is sent. To see what a channel adds, open the channel and look at "Added when sending"',
      'try.url': 'Request URL',
      'try.body': 'Request body (JSON)',
      'try.bodyHint': 'Handled here only: it is not sent and not written to disk',
      'try.session': 'Session ID (optional)',
      'try.sessionHint': 'To see what {{session}} becomes',
      'try.run': 'Try it',
      'try.reset': 'Reset sample',
      'try.useDraft': 'Use unsaved changes',
      'try.paused': 'All parameters are paused, so the request is not changed',
      'try.notModelEndpoint': 'This URL does not look like a model endpoint (…/chat/completions, …/messages, …/responses). Parameters only reach model endpoints unless they name a path',
      'try.noMatch': 'No parameter applies to this request. Check the host, model, and path',
      'try.unchanged': 'The parameters that apply changed nothing (the request already has those values)',
      'try.resultBody': 'Request body after the parameters',
      'try.resultHeaders': 'Header changes',
      'import.title': 'Import',
      'import.hint': 'Paste exported JSON or choose a file. Imported parameters go into the draft and take effect after you save',
      'import.read': 'Read',
      'import.file': 'Choose a file…',
      'import.found': 'Found {n} parameters:',
      'import.found.one': 'Found 1 parameter:',
      'import.problems': '{n} of them have problems and need fixing before you can save',
      'import.problems.one': '1 of them has problems and needs fixing before you can save',
      'import.unsaved': 'Click Save afterwards to make them live',
      'import.append': 'Add to current parameters',
      'import.replace': 'Replace all parameters',
      'import.confirmReplace': 'Replace all current parameters with the imported ones?',
      'import.empty': 'No parameters found',
      'import.applied': 'Imported into the draft. Check it, then Save',
      'import.tooLarge': 'File is too large (over 2 MB)',
      'import.unreadable': 'Could not read that file',
      'help.title': 'How it works',
      'help.what': 'Before dsh sends a request to a model, the fields and headers you chose are added: OpenRouter provider routing, reasoning, fallback models, or any JSON field a gateway accepts.',
      'help.how': 'Parameters are organized by channel: pick a channel and add parameters; "Added when sending" shows at once what the request will carry, and "Recent requests" shows how real requests went. Addresses outside every channel live under "Other addresses" and name their own hosts, paths, and models. It works with the official DeepSeek endpoint and with the OpenAI-compatible and Anthropic-compatible channels in llm-pi-ai.',
      'help.templates': 'Values may use {{model}} (the model), {{session}} (the session ID), and {{env:NAME}} (an environment variable; good for keys, never shown).',
      'help.safety': 'For safety, core fields such as messages, tools, and model cannot be changed unless custom fields and headers opt in, and credential headers such as Authorization and x-api-key can never be changed. If a parameter has a problem the request goes out unchanged instead of being blocked.',
      'help.privacy': 'Parameters are stored in .dsh-request-params/config.json next to your profile. The request log lives in memory and is never written to disk; it keeps no conversation text, only the first 2 KB of an error the gateway returned. While a provider routing parameter is on the page, it reads the public OpenRouter provider and model catalog, sending no keys or content.',
      'save.bar': 'Save changes',
      'save.unsaved': 'Unsaved changes',
      'save.hint': 'Ctrl/⌘ + S to save',
      'save.save': 'Save',
      'save.saving': 'Saving…',
      'save.discard': 'Discard',
      'save.confirmDiscard': 'Discard all unsaved changes?',
      'save.blocked': '{n} enabled parameters have problems; fix them to save',
      'save.blocked.one': '1 enabled parameter has problems; fix it to save',
      'save.building': 'Building…',
      'conflict.text': 'The rules file changed while you were editing (another page or a hand edit)',
      'conflict.reload': 'Load the latest (drop my changes)',
      'conflict.overwrite': 'Keep my changes',
      'damaged.title': 'The rules file cannot be read, so no parameter is active right now',
      'damaged.detail': '{path}: {reason}',
      'damaged.reset': 'Move it aside and start fresh',
      'damaged.confirm': 'Rename the damaged file as a backup and start from an empty list?',
      'damaged.done': 'Moved the old file to {path}',
      'err.network': 'Cannot reach DSH; try again in a moment',
      'err.conflict': 'The rules file changed; load it again',
      'err.config-damaged': 'The rules file is damaged; deal with it first',
      'err.too-large': 'That is too large',
      'err.bad-url': 'Enter a full URL, such as https://openrouter.ai/api/v1/chat/completions',
      'err.offline': 'Cannot reach OpenRouter; try again later',
      'err.bad-response': 'Got an answer that could not be read',
      'err.bad-model': 'A model ID looks like author/name, e.g. deepseek/deepseek-chat',
      'err.bad-request': 'Bad request',
    }

    const CSS = `
.rp { --rp-fg: var(--dsw-alias-label-primary); --rp-fg2: var(--dsw-alias-label-secondary); --rp-fg3: var(--dsw-alias-label-tertiary); --rp-line: var(--dsw-alias-border-l2); --rp-line2: var(--dsw-alias-border-l3); --rp-tint: var(--dsw-alias-interactive-bg-hover); --rp-tint2: var(--dsw-alias-interactive-bg-active); --rp-surface: var(--dsw-alias-bg-layer-1); --rp-raised: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-1)); --rp-code: var(--dsw-alias-markdown-code-block, var(--dsw-alias-interactive-bg-hover)); --rp-accent: var(--dsw-alias-state-business-primary); --rp-accent-bg: var(--dsw-alias-state-business-tertiary, var(--dsw-alias-interactive-bg-hover)); --rp-ok: var(--dsw-alias-state-success-primary, #2da44e); --rp-ok-bg: var(--dsw-alias-state-success-tertiary, var(--dsw-alias-interactive-bg-hover)); --rp-warn: var(--dsw-alias-state-warn-primary, #b7791f); --rp-warn-bg: var(--dsw-alias-state-warn-tertiary, var(--dsw-alias-interactive-bg-hover)); --rp-warn-fg: var(--dsw-alias-state-warn-label, var(--dsw-alias-label-primary)); --rp-bad: var(--dsw-alias-state-error-primary, #d93025); --rp-r-sm: 8px; --rp-r-md: 12px; --rp-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; box-sizing: border-box; height: 100%; overflow-y: auto; display: flex; flex-direction: column; color: var(--rp-fg); font-size: 13px; line-height: 1.5; }
.rp *, .rp *::before, .rp *::after { box-sizing: border-box; }
.rp-inner { container: rp-page / inline-size; flex: 1 0 auto; width: 100%; max-width: 1080px; margin: 0 auto; padding: 24px 28px 120px; display: flex; flex-direction: column; gap: 20px; }
.rp-top { display: flex; align-items: flex-start; gap: 12px 16px; }
.rp-heading { flex: 1 1 auto; min-width: 0; }
.rp-title { margin: 0; display: flex; align-items: baseline; gap: 8px; font-size: 20px; font-weight: 600; line-height: 28px; }
.rp-version { font-size: 12px; font-weight: 400; color: var(--rp-fg3); }
.rp-status { margin: 2px 0 0; display: flex; align-items: center; gap: 8px; color: var(--rp-fg2); font-size: 12px; }
.rp-topactions { flex: none; display: flex; align-items: center; gap: 6px; }
.rp-master { display: inline-flex; align-items: center; gap: 8px; height: 30px; padding: 0 12px 0 6px; border-radius: 999px; border: .5px solid var(--rp-line2); font-size: 12px; font-weight: 500; color: var(--rp-fg2); cursor: pointer; user-select: none; }
.rp-master.is-off { color: var(--rp-warn); border-color: currentColor; }
.rp-split { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 28px; align-items: start; }
.rp-nav { position: sticky; top: 16px; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.rp-navlabel { padding: 14px 10px 4px; font-size: 11px; font-weight: 500; color: var(--rp-fg3); }
.rp-navlabel:first-child { padding-top: 2px; }
.rp-navitem { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 34px; padding: 5px 10px; border: 0; border-radius: var(--rp-r-sm); background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; }
.rp-navitem[aria-current="page"] { background: var(--rp-tint2); }
.rp-navitem[aria-current="page"] .rp-navname { font-weight: 600; }
.rp-navicon { flex: none; display: flex; color: var(--rp-fg3); }
.rp-navtext { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.rp-navname, .rp-navsub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rp-navsub { font-size: 11px; line-height: 1.4; color: var(--rp-fg3); }
.rp-navend { flex: none; display: flex; align-items: center; gap: 6px; }
.rp-navhint { padding: 4px 10px; font-size: 12px; color: var(--rp-fg3); }
.rp-count { min-width: 18px; height: 18px; padding: 0 6px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; background: var(--rp-tint2); color: var(--rp-fg2); }
.rp-count.is-on { background: var(--rp-accent-bg); color: var(--rp-accent); }
.rp-dot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--rp-line2); }
.rp-dot.is-ok { background: var(--rp-ok); }
.rp-dot.is-bad { background: var(--rp-bad); }
.rp-dot.is-warn { background: var(--rp-warn); }
.rp-detail { container: rp-detail / inline-size; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.rp-dhead { display: flex; align-items: flex-start; gap: 12px; }
.rp-dtitle { margin: 0; font-size: 17px; font-weight: 600; line-height: 26px; overflow-wrap: anywhere; }
.rp-dsub { display: flex; flex-wrap: wrap; gap: 2px 12px; align-items: center; margin-top: 2px; color: var(--rp-fg3); font-size: 12px; }
.rp-url { font-family: var(--rp-mono); font-size: 12px; color: var(--rp-fg2); overflow-wrap: anywhere; }
.rp-section { display: flex; flex-direction: column; gap: 8px; }
.rp-sectionhead { display: flex; align-items: center; gap: 8px; min-height: 26px; }
.rp-sectiontitle { font-size: 13px; font-weight: 600; }
.rp-grow { flex: 1 1 auto; min-width: 0; }
.rp-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.rp-bar > .rp-input { flex: 1 1 200px; width: auto; }
.rp-end { justify-content: flex-end; }
.rp-icon { flex: none; display: block; }
.rp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 30px; padding: 0 12px; border-radius: var(--rp-r-sm); border: .5px solid var(--rp-line2); background: var(--rp-surface); font: inherit; font-size: 12px; font-weight: 500; color: inherit; cursor: pointer; white-space: nowrap; }
.rp-btn:disabled { opacity: .45; cursor: default; }
.rp-btn.is-primary { background: var(--dsw-alias-button-primary-fill); border-color: transparent; color: var(--dsw-alias-label-primary-inverted, var(--dsw-alias-bg-layer-1)); }
.rp-btn.is-ghost { border-color: transparent; background: transparent; color: var(--rp-fg2); }
.rp-btn.is-icon { width: 30px; padding: 0; }
.rp-btn.is-sm { height: 26px; padding: 0 9px; }
.rp-btn.is-sm.is-icon { width: 26px; padding: 0; }
.rp-btn.is-danger { color: var(--rp-bad); }
.rp-link { display: inline-flex; align-items: center; gap: 4px; align-self: flex-start; padding: 0; border: 0; background: none; font: inherit; font-size: 12px; font-weight: 500; color: var(--rp-accent); cursor: pointer; }
.rp-link .rp-icon { transition: transform .15s; }
.rp-link[aria-expanded="true"] .rp-icon { transform: rotate(90deg); }
.rp-input { display: block; width: 100%; min-width: 0; height: 32px; padding: 0 10px; border-radius: var(--rp-r-sm); border: .5px solid var(--rp-line2); background: var(--rp-surface); font: inherit; color: inherit; }
.rp-input::placeholder, .rp-chipinput::placeholder { color: var(--rp-fg3); }
.rp-input:focus { outline: none; border-color: var(--rp-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--rp-accent) 16%, transparent); }
.rp-input.is-bad { border-color: var(--rp-bad); }
.rp-mono { font-family: var(--rp-mono); font-size: 12px; }
.rp-textarea { height: auto; min-height: 96px; padding: 8px 10px; font-family: var(--rp-mono); font-size: 12px; line-height: 1.55; resize: vertical; }
.rp-select { width: auto; max-width: 100%; }
.rp-hidden { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.rp-hint { font-size: 12px; line-height: 1.5; color: var(--rp-fg3); }
.rp-hint.is-error { color: var(--rp-bad); }
.rp-hint.is-warn { color: var(--rp-warn); }
.rp-dim { color: var(--rp-fg3); }
.rp-label { font-size: 12px; font-weight: 500; color: var(--rp-fg2); }
.rp-note { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 8px 12px; border-radius: var(--rp-r-sm); background: var(--rp-tint); font-size: 12px; line-height: 1.5; color: var(--rp-fg2); }
.rp-note.is-warn { background: var(--rp-warn-bg); color: var(--rp-warn-fg); }
.rp-note.is-bad { background: color-mix(in srgb, var(--rp-bad) 10%, transparent); color: var(--rp-bad); }
.rp-problems { margin: 0; padding-left: 16px; }
.rp-badge { flex: none; display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: 6px; font-size: 11px; font-weight: 500; white-space: nowrap; background: var(--rp-tint2); color: var(--rp-fg2); }
.rp-badge.is-accent { background: var(--rp-accent-bg); color: var(--rp-accent); }
.rp-badge.is-ok { background: var(--rp-ok-bg); color: var(--rp-ok); }
.rp-badge.is-warn { background: var(--rp-warn-bg); color: var(--rp-warn-fg); }
.rp-badge.is-bad { background: color-mix(in srgb, var(--rp-bad) 12%, transparent); color: var(--rp-bad); }
.rp-switch { flex: none; position: relative; width: 32px; height: 20px; padding: 0; border: 0; border-radius: 10px; background: var(--dsw-alias-border-l4, var(--rp-line2)); cursor: pointer; transition: background .15s; }
.rp-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--dsw-alias-switch-thumb, #fff); box-shadow: 0 1px 2px rgba(0, 0, 0, .2); transition: transform .15s; }
.rp-switch[aria-checked="true"] { background: var(--rp-accent); }
.rp-switch[aria-checked="true"]::after { transform: translateX(12px); background: #fff; }
.rp-switch:disabled { opacity: .4; cursor: default; }
.rp-seg { display: inline-flex; align-self: flex-start; flex-wrap: wrap; gap: 2px; padding: 2px; border-radius: var(--rp-r-sm); background: var(--rp-tint); }
.rp-seg button { height: 26px; padding: 0 12px; border: 0; border-radius: 6px; background: none; font: inherit; font-size: 12px; color: var(--rp-fg2); cursor: pointer; }
.rp-seg button[aria-checked="true"] { background: var(--rp-raised); color: var(--rp-fg); font-weight: 500; box-shadow: 0 0 0 .5px var(--rp-line2), 0 1px 2px rgba(0, 0, 0, .06); }
.rp-seg button:focus-visible { outline-offset: -2px; }
.rp-checks { display: flex; flex-direction: column; gap: 8px; padding-top: 6px; }
.rp-check { display: flex; gap: 8px; align-items: flex-start; cursor: pointer; }
.rp-check input { flex: none; width: 14px; height: 14px; margin: 3px 0 0; accent-color: var(--rp-accent); }
.rp-checktext { display: flex; flex-direction: column; gap: 1px; }
.rp-toggles { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 4px; }
.rp-toggle { height: 24px; padding: 0 10px; border-radius: 999px; border: .5px solid var(--rp-line2); background: none; font: inherit; font-family: var(--rp-mono); font-size: 11px; color: var(--rp-fg2); cursor: pointer; }
.rp-toggle[aria-pressed="true"] { border-color: var(--rp-accent); background: var(--rp-accent-bg); color: var(--rp-accent); }
.rp-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-height: 32px; padding: 3px 4px; border-radius: var(--rp-r-sm); border: .5px solid var(--rp-line2); background: var(--rp-surface); cursor: text; }
.rp-chips:focus-within { border-color: var(--rp-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--rp-accent) 16%, transparent); }
.rp-chip { display: inline-flex; align-items: center; gap: 2px; max-width: 100%; height: 24px; padding: 0 2px 0 8px; border-radius: 6px; background: var(--rp-tint2); font-size: 12px; }
.rp-chiptext { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rp-chipx { flex: none; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 4px; background: none; color: var(--rp-fg3); cursor: pointer; }
.rp-chipinput { flex: 1 1 140px; min-width: 100px; height: 24px; padding: 0 6px; border: 0; outline: 0; background: transparent; font: inherit; color: inherit; }
.rp-orderlist { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; border: .5px solid var(--rp-line2); border-radius: var(--rp-r-sm); overflow: hidden; }
.rp-orderitem { display: flex; align-items: center; gap: 8px; min-height: 36px; padding: 2px 4px 2px 10px; }
.rp-orderitem + .rp-orderitem { border-top: .5px solid var(--rp-line); }
.rp-ordernum { flex: none; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--rp-tint2); font-size: 11px; color: var(--rp-fg2); }
.rp-ordertext { flex: 1 1 auto; min-width: 0; display: flex; align-items: baseline; gap: 8px; overflow: hidden; white-space: nowrap; }
.rp-ordertext > * { overflow: hidden; text-overflow: ellipsis; }
.rp-slug { font-family: var(--rp-mono); font-size: 11px; color: var(--rp-fg3); }
.rp-unit { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rp-unit .rp-input { flex: 0 1 140px; }
.rp-pair { display: flex; gap: 12px 16px; flex-wrap: wrap; }
.rp-pair > .rp-paired { display: flex; align-items: center; gap: 8px; }
.rp-headerrow { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }
.rp-headerrow .rp-input:first-child { flex: 0 1 200px; }
.rp-envs { display: flex; flex-wrap: wrap; gap: 6px; }
.rp-rows { display: grid; grid-template-columns: 116px minmax(0, 1fr); gap: 16px 18px; align-items: start; }
.rp-rowlabel { padding-top: 6px; font-size: 12px; font-weight: 500; color: var(--rp-fg2); overflow-wrap: anywhere; }
.rp-rowbody { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.rp-rowfull { grid-column: 1 / -1; }
.rp-subpanel { display: flex; flex-direction: column; gap: 12px; padding: 12px 14px; border-radius: var(--rp-r-sm); background: var(--rp-tint); }
.rp-subtitle { font-size: 12px; font-weight: 600; color: var(--rp-fg2); }
.rp-cards { display: flex; flex-direction: column; gap: 10px; }
.rp-card { border: .5px solid var(--rp-line2); border-radius: var(--rp-r-md); background: var(--rp-surface); scroll-margin: 24px; }
.rp-card.is-off .rp-cardtitle, .rp-card.is-off .rp-cardsum, .rp-card.is-off .rp-typeicon { opacity: .5; }
.rp-cardhead { display: flex; align-items: center; gap: 8px; min-height: 52px; padding: 6px 10px 6px 6px; }
.rp-cardhead > .rp-input { flex: 1 1 auto; width: auto; }
.rp-cardtoggle { flex: 1 1 auto; min-width: 0; align-self: stretch; display: flex; align-items: center; gap: 10px; padding: 0 6px; border: 0; border-radius: var(--rp-r-sm); background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; }
.rp-typeicon { flex: none; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; background: var(--rp-tint2); color: var(--rp-fg2); }
.rp-cardtitle { flex: 0 1 auto; max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
.rp-cardsum { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: var(--rp-fg3); }
.rp-chev { flex: none; display: flex; color: var(--rp-fg3); transition: transform .15s; }
.rp-cardtoggle[aria-expanded="true"] .rp-chev, .rp-reqhead[aria-expanded="true"] .rp-chev { transform: rotate(90deg); }
.rp-scope { flex: none; max-width: 200px; height: 24px; padding: 0 9px; border-radius: 999px; border: .5px dashed var(--rp-line2); background: none; font: inherit; font-size: 11px; color: var(--rp-fg3); cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rp-scope.is-set { border-style: solid; color: var(--rp-fg2); font-family: var(--rp-mono); }
.rp-scope.is-miss { border-color: var(--rp-warn); color: var(--rp-warn); }
.rp-cardbody { display: flex; flex-direction: column; gap: 16px; padding: 16px 16px 18px; border-top: .5px solid var(--rp-line); }
.rp-preview { border-radius: var(--rp-r-md); border: .5px solid var(--rp-line); background: var(--rp-code); overflow: hidden; }
.rp-previewhead { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-height: 44px; padding: 6px 8px 6px 14px; border-bottom: .5px solid var(--rp-line); }
.rp-previewtitle { font-size: 12px; font-weight: 600; }
.rp-previewmodel { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--rp-fg3); }
.rp-previewmodel .rp-input { width: 250px; height: 28px; font-family: var(--rp-mono); font-size: 11px; }
.rp-previewbody { display: flex; flex-direction: column; gap: 10px; min-height: 46px; padding: 12px 14px 14px; }
.rp-code { margin: 0; font-family: var(--rp-mono); font-size: 12px; line-height: 1.6; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--rp-fg); }
.rp-jk { color: var(--rp-fg); }
.rp-js { color: var(--rp-accent); }
.rp-jn { color: var(--rp-warn); }
.rp-lines { display: flex; flex-direction: column; gap: 2px; }
.rp-lines .rp-label { margin-bottom: 2px; }
.rp-line { display: flex; gap: 8px; font-family: var(--rp-mono); font-size: 12px; overflow-wrap: anywhere; }
.rp-line .rp-sign { flex: none; width: 10px; color: var(--rp-ok); }
.rp-line.is-remove .rp-sign { color: var(--rp-bad); }
.rp-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); gap: 8px; }
.rp-tile { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: var(--rp-r-md); border: .5px solid var(--rp-line2); background: var(--rp-surface); font: inherit; color: inherit; text-align: left; cursor: pointer; }
.rp-tiletext { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.rp-tilename { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-weight: 600; }
.rp-tiledesc { font-size: 12px; line-height: 1.45; color: var(--rp-fg2); }
.rp-menuitem .rp-tiledesc { font-size: 11px; color: var(--rp-fg3); }
.rp-grouplabel { margin-top: 6px; font-size: 12px; color: var(--rp-fg3); }
.rp-empty { display: flex; flex-direction: column; gap: 12px; }
.rp-emptyhead { display: flex; flex-direction: column; gap: 2px; padding: 4px 0; }
.rp-emptytitle { font-size: 14px; font-weight: 600; }
.rp-pop { position: relative; flex: none; }
.rp-popbody, .rp-pickerlist { position: absolute; z-index: 30; padding: 4px; border-radius: var(--rp-r-md); border: .5px solid var(--rp-line2); background: var(--rp-raised); box-shadow: 0 12px 32px rgba(0, 0, 0, .16), 0 2px 6px rgba(0, 0, 0, .06); }
.rp-popbody { top: calc(100% + 6px); min-width: 200px; width: max-content; max-width: min(360px, 86vw); max-height: 440px; overflow-y: auto; }
.rp-popbody.is-end { right: 0; }
.rp-popbody.is-start { left: 0; }
.rp-popbody.is-wide { width: 340px; }
.rp-menuitem { display: flex; align-items: flex-start; gap: 10px; width: 100%; padding: 7px 10px; border: 0; border-radius: 6px; background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; }
.rp-menuitem:focus-visible { outline: none; background: var(--rp-tint2); }
.rp-menuitem:disabled { opacity: .4; cursor: default; }
.rp-menuitem.is-danger { color: var(--rp-bad); }
.rp-menuitem .rp-typeicon { width: 26px; height: 26px; }
.rp-menusep { height: .5px; margin: 4px 6px; background: var(--rp-line); }
.rp-menulabel { padding: 6px 10px 3px; font-size: 11px; color: var(--rp-fg3); }
.rp-picker { position: relative; }
.rp-pickerlist { left: 0; right: 0; top: calc(100% + 4px); max-height: 320px; overflow-y: auto; }
.rp-option { display: flex; align-items: center; gap: 10px; min-height: 32px; padding: 4px 10px; border-radius: 6px; cursor: pointer; }
.rp-option[aria-selected="true"] { background: var(--rp-tint2); }
.rp-option.is-added { opacity: .5; }
.rp-optiontext { flex: 1 1 auto; min-width: 0; display: flex; align-items: baseline; gap: 8px; overflow: hidden; white-space: nowrap; }
.rp-optiontext > * { overflow: hidden; text-overflow: ellipsis; }
.rp-optionmeta { flex: none; font-size: 11px; color: var(--rp-fg3); font-variant-numeric: tabular-nums; }
.rp-reqs { display: flex; flex-direction: column; border: .5px solid var(--rp-line2); border-radius: var(--rp-r-md); overflow: hidden; }
.rp-req + .rp-req { border-top: .5px solid var(--rp-line); }
.rp-reqhead { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 42px; padding: 6px 12px; border: 0; background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; }
.rp-code-badge { flex: none; min-width: 36px; height: 20px; padding: 0 6px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-family: var(--rp-mono); font-size: 11px; background: var(--rp-tint2); color: var(--rp-fg2); }
.rp-code-badge.is-ok { background: var(--rp-ok-bg); color: var(--rp-ok); }
.rp-code-badge.is-bad { background: color-mix(in srgb, var(--rp-bad) 12%, transparent); color: var(--rp-bad); }
.rp-reqmodel { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--rp-mono); font-size: 12px; }
.rp-reqwhere { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: var(--rp-fg3); }
.rp-reqtag { flex: none; font-size: 11px; color: var(--rp-fg3); white-space: nowrap; }
.rp-reqtag.is-on { color: var(--rp-accent); }
.rp-reqtag.is-warn { color: var(--rp-warn); }
.rp-reqtime { flex: none; min-width: 60px; text-align: right; font-size: 11px; color: var(--rp-fg3); white-space: nowrap; }
.rp-reqbody { display: flex; flex-direction: column; gap: 8px; padding: 2px 14px 14px 58px; }
.rp-changes { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 3px; }
.rp-change { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; font-size: 12px; }
.rp-change .rp-sign { flex: none; min-width: 22px; text-align: center; font-weight: 600; color: var(--rp-accent); }
.rp-change.is-remove .rp-sign, .rp-change.is-header-remove .rp-sign { color: var(--rp-bad); }
.rp-change.is-default .rp-sign { color: var(--rp-fg3); }
.rp-changepath, .rp-changevalue { font-family: var(--rp-mono); font-size: 12px; overflow-wrap: anywhere; }
.rp-changevalue { color: var(--rp-fg2); }
.rp-pre { margin: 0; max-height: 280px; overflow: auto; padding: 8px 10px; border-radius: var(--rp-r-sm); background: var(--rp-code); white-space: pre-wrap; overflow-wrap: anywhere; font-family: var(--rp-mono); font-size: 12px; line-height: 1.5; }
.rp-diff { max-height: 440px; padding: 4px 0; white-space: pre; overflow-wrap: normal; }
.rp-diffline { display: flex; gap: 8px; padding: 0 10px; }
.rp-diffline.is-add { background: var(--dsw-alias-code-diff-added, color-mix(in srgb, var(--rp-ok) 16%, transparent)); }
.rp-diffline.is-del { background: var(--dsw-alias-code-diff-deleted, color-mix(in srgb, var(--rp-bad) 14%, transparent)); text-decoration: line-through; opacity: .85; }
.rp-diffsign { flex: none; width: 10px; color: var(--rp-fg3); }
.rp-endpoints { display: flex; flex-direction: column; border: .5px solid var(--rp-line2); border-radius: var(--rp-r-md); overflow: hidden; }
.rp-endpoint { display: flex; align-items: center; gap: 10px; padding: 8px 12px; }
.rp-endpoint + .rp-endpoint { border-top: .5px solid var(--rp-line); }
.rp-endpointmain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.rp-panel { display: flex; flex-direction: column; gap: 12px; padding: 16px 18px; border-radius: var(--rp-r-md); border: .5px solid var(--rp-line2); background: var(--rp-surface); }
.rp-panel:focus { outline: none; }
.rp-helpp { margin: 0; line-height: 1.65; color: var(--rp-fg2); }
.rp-confirm { display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border-radius: var(--rp-r-sm); background: var(--rp-warn-bg); color: var(--rp-warn-fg); }
.rp-form { display: flex; flex-direction: column; gap: 12px; }
.rp-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.rp-skeleton { display: flex; flex-direction: column; gap: 10px; }
.rp-skeleton span { display: block; height: 52px; border-radius: var(--rp-r-md); background: var(--dsw-alias-bg-skeleton, var(--rp-tint)); animation: rp-pulse .9s ease-in-out infinite alternate; }
.rp-dock { position: sticky; bottom: 16px; z-index: 20; height: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 8px; padding: 0 16px; pointer-events: none; }
.rp-dock > * { pointer-events: auto; }
.rp-toast, .rp-savebar { display: flex; align-items: center; gap: 10px; max-width: min(640px, 100%); border-radius: 14px; background: var(--dsw-alias-toast-bg, #2b2f36); color: var(--dsw-alias-toast-label, #fff); box-shadow: 0 12px 32px rgba(0, 0, 0, .24); font-size: 12px; }
.rp-toast { padding: 6px 6px 6px 14px; }
.rp-toast.is-warn { box-shadow: 0 12px 32px rgba(0, 0, 0, .24), inset 3px 0 0 var(--rp-warn); }
.rp-savebar { padding: 8px 8px 8px 16px; }
.rp-savetext { display: flex; flex-direction: column; min-width: 0; }
.rp-savetext strong { font-weight: 600; }
.rp-savetext span { opacity: .7; }
.rp-savetext .is-bad { color: #ff8a80; opacity: 1; }
.rp-onbar { height: 30px; padding: 0 12px; border: 0; border-radius: var(--rp-r-sm); background: transparent; font: inherit; font-size: 12px; font-weight: 500; color: inherit; cursor: pointer; white-space: nowrap; }
.rp-onbar.is-primary { background: var(--dsw-alias-toast-label, #fff); color: var(--dsw-alias-toast-bg, #2b2f36); }
.rp-onbar.is-icon { width: 30px; padding: 0; display: inline-flex; align-items: center; justify-content: center; opacity: .7; }
.rp-onbar:disabled { opacity: .4; cursor: default; }
.rp :is(button, input, select, textarea, [tabindex]):focus-visible { outline: 2px solid var(--rp-accent); outline-offset: 2px; }
.rp .rp-input:focus-visible, .rp .rp-chipinput:focus-visible { outline: none; }
@keyframes rp-pulse { from { opacity: .45 } to { opacity: .9 } }
@media (prefers-reduced-motion: reduce) { .rp-skeleton span { animation: none; } .rp-chev, .rp-link .rp-icon, .rp-switch, .rp-switch::after { transition: none; } }
@media (hover: hover) { .rp-navitem:hover, .rp-cardtoggle:hover, .rp-reqhead:hover, .rp-menuitem:hover:not(:disabled), .rp-btn.is-ghost:hover:not(:disabled), .rp-chipx:hover, .rp-scope:hover, .rp-toggle:hover, .rp-seg button:hover:not([aria-checked="true"]) { background: var(--rp-tint); } .rp-btn:hover:not(:disabled):not(.is-ghost):not(.is-primary), .rp-tile:hover { background: var(--rp-tint); border-color: var(--dsw-alias-border-l4, var(--rp-line2)); } .rp-btn.is-primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover, var(--dsw-alias-button-primary-fill)); } .rp-onbar:hover:not(:disabled):not(.is-primary) { background: rgba(255, 255, 255, .12); } .rp-link:hover { text-decoration: underline; } }
@container rp-page (max-width: 760px) { .rp-split { grid-template-columns: minmax(0, 1fr); gap: 16px; } .rp-nav { position: static; flex-direction: row; flex-wrap: wrap; gap: 6px; } .rp-navlabel, .rp-navsub, .rp-navhint, .rp-navicon { display: none; } .rp-navitem { width: auto; min-height: 30px; padding: 3px 12px; border: .5px solid var(--rp-line2); border-radius: 999px; } }
@container rp-detail (max-width: 560px) { .rp-rows { grid-template-columns: minmax(0, 1fr); gap: 4px; } .rp-rowlabel { padding-top: 10px; } .rp-rows > .rp-rowlabel:first-child { padding-top: 0; } .rp-reqwhere, .rp-cardsum, .rp-reqtag { display: none; } .rp-reqbody { padding-left: 14px; } .rp-headerrow { flex-wrap: wrap; } .rp-headerrow .rp-input:first-child { flex: 1 1 100%; } .rp-previewmodel .rp-input { width: 180px; } }
@media (max-width: 640px) { .rp-inner { padding: 16px 16px 120px; } }
`

    class ActionFailure extends Error {
      constructor(code, message, details) {
        super(message)
        this.code = code
        this.details = details
      }
    }

    async function post(action, payload) {
      let response
      try {
        response = await fetch(ROUTE, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action, ...payload }),
        })
      } catch {
        throw new ActionFailure('network', 'Network error')
      }
      if (!response.ok) throw new ActionFailure(response.status === 404 ? 'network' : 'failed', `HTTP ${response.status}`)
      const body = await response.json()
      if (body.ok !== true) throw new ActionFailure(body.code ?? 'failed', body.error, body.details)
      return body.value
    }

    const clone = value => JSON.parse(JSON.stringify(value))
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
    const pretty = value => JSON.stringify(value, null, 2)
    /** Whether a form number field holds something (a number, or text typed into it). */
    const filled = value => value !== null && value !== undefined && String(value).trim() !== ''

    function newId() {
      const bytes = new Uint8Array(4)
      window.crypto.getRandomValues(bytes)
      return `r${[...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('')}`
    }

    function blankRule(fields = {}) {
      return {
        id: newId(),
        name: '',
        enabled: true,
        match: { hosts: [], paths: [], models: [] },
        body: { merge: {}, defaults: {}, remove: [] },
        headers: { set: {}, remove: [] },
        allowProtected: false,
        ...fields,
      }
    }

    /** `key` for most counts, `key.one` for exactly one; both languages define the pair. */
    const pl = (t, key, n, params = {}) => t(n === 1 ? `${key}.one` : key, { n, ...params })

    function localeOf(lang) {
      return lang === 'zh' ? 'zh-CN' : 'en-US'
    }

    function clock(lang, at) {
      return new Date(at).toLocaleTimeString(localeOf(lang), { hour12: false })
    }

    function ago(lang, at, now = Date.now()) {
      const seconds = Math.round((at - now) / 1000)
      const rtf = new Intl.RelativeTimeFormat(localeOf(lang), { numeric: 'auto' })
      if (Math.abs(seconds) < 60) return rtf.format(seconds, 'second')
      if (Math.abs(seconds) < 3600) return rtf.format(Math.round(seconds / 60), 'minute')
      if (Math.abs(seconds) < 86400) return rtf.format(Math.round(seconds / 3600), 'hour')
      return rtf.format(Math.round(seconds / 86400), 'day')
    }

    /** Escape closes a panel or a confirmation without also closing what surrounds it. */
    function onEscape(close) {
      return (event) => {
        if (event.key !== 'Escape' || event.nativeEvent?.isComposing) return
        event.preventDefault()
        event.stopPropagation()
        close()
      }
    }

    /**
     * Arrow keys move between the buttons of a `role=radiogroup` strip without choosing one; Enter or Space chooses,
     * so moving through a strip never changes a setting by itself.
     */
    function radioKeys(event) {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
      if (step === undefined) return
      const radios = [...event.currentTarget.querySelectorAll('[role=radio]:not(:disabled)')]
      const at = radios.indexOf(document.activeElement)
      if (at < 0) return
      event.preventDefault()
      radios[(at + step + radios.length) % radios.length].focus()
    }

    /** Up and Down move between the items of an open menu. */
    function menuKeys(event) {
      const step = { ArrowDown: 1, ArrowUp: -1 }[event.key]
      if (step === undefined) return
      const items = [...event.currentTarget.querySelectorAll('[role=menuitem]:not(:disabled)')]
      if (items.length === 0) return
      event.preventDefault()
      const at = items.indexOf(document.activeElement)
      items[(at + step + items.length) % items.length].focus()
    }

    /** A ref for a panel's root: the panel takes focus when it opens, unless something inside it already has. */
    function usePanelFocus() {
      const ref = React.useRef(null)
      React.useEffect(() => {
        const node = ref.current
        if (node !== null && !node.contains(document.activeElement)) node.focus({ preventScroll: true })
      }, [])
      return ref
    }

    /** `value`, but only after it has stopped changing for `ms`. */
    function useDebounced(value, ms) {
      const [settled, setSettled] = React.useState(value)
      React.useEffect(() => {
        const timer = setTimeout(() => setSettled(value), ms)
        return () => clearTimeout(timer)
      }, [value, ms])
      return settled
    }

    function readStored(storage, key, fallback) {
      try {
        const value = JSON.parse(window[storage].getItem(key) ?? 'null')
        return value === null ? fallback : value
      } catch {
        // Storage can be blocked or hold something else; the page then starts without it.
        return fallback
      }
    }

    function writeStored(storage, key, value) {
      try {
        if (value === undefined) window[storage].removeItem(key)
        else window[storage].setItem(key, JSON.stringify(value))
      } catch {
        // Storage can be blocked or full; the value is then not kept.
      }
    }

    /** One catalog read per kind and refresh, shared by every form on the page. */
    const catalogs = new Map()
    function loadCatalog(action, payload = {}, refresh = false) {
      const key = `${action}:${JSON.stringify(payload)}`
      if (refresh || !catalogs.has(key)) {
        const request = post(action, { ...payload, ...refresh ? { refresh: true } : {} })
        catalogs.set(key, request)
        request.catch(() => { if (catalogs.get(key) === request) catalogs.delete(key) })
      }
      return catalogs.get(key)
    }

    /** OpenRouter's provider list, read once the page shows a routing parameter. */
    function useProviders(wanted) {
      const [value, setValue] = React.useState(null)
      React.useEffect(() => {
        if (!wanted || value !== null) return undefined
        let alive = true
        loadCatalog('orProviders').then(next => { if (alive) setValue(next) }, () => { if (alive) setValue({ providers: [], source: 'none' }) })
        return () => { alive = false }
      }, [wanted])
      return value
    }

    /** Models OpenRouter lists, fetched the first time a field that suggests them is used. */
    function useModels() {
      const [state, setState] = React.useState(null)
      const asked = React.useRef(false)
      const request = React.useCallback(() => {
        if (asked.current) return
        asked.current = true
        loadCatalog('orModels').then(setState, () => setState({ models: [] }))
      }, [])
      return [state, request]
    }

    /** The engine's host test (rules.js `hostMatches`): `*.x` also covers `x`, and a pattern without a port covers any port. */
    function hostMatches(pattern, url) {
      if (pattern === '*') return true
      const host = (pattern.includes(':') ? url.host : url.hostname).toLowerCase()
      if (pattern.startsWith('*.')) {
        const suffix = pattern.slice(2)
        return host === suffix || host.endsWith(`.${suffix}`)
      }
      return host === pattern
    }

    /** The engine's model test (rules.js `modelMatches`): `*` is any run of characters, case is ignored. */
    function modelMatches(pattern, model) {
      const parts = pattern.toLowerCase().split('*').map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
      return new RegExp(`^${parts.join('.*')}$`).test(model.toLowerCase())
    }

    const OR_MODEL = /^[\w.~-]+\/[\w.:~@+-]+$/

    /** Whether a rule's hosts and paths reach a channel's model requests, by the engine's tests; models are not considered. */
    function reaches(rule, channel) {
      if (channel.baseURL === undefined) return false
      const url = new URL(channel.baseURL)
      if (!rule.match.hosts.some(pattern => hostMatches(pattern, url))) return false
      const base = `${channel.basePath}/`
      return rule.match.paths.length === 0 || rule.match.paths.some(path => base.startsWith(path) || path.startsWith(base))
    }

    /** What a rule needs to reach one channel: its host, its base path when another channel shares the host, and its models when one shares the base URL. */
    function matchOfChannel(channel) {
      // Two channels with the same base URL differ only in their models.
      const models = channel.sameEndpoint && channel.models.length > 0 && channel.models.length <= 50 ? channel.models.map(model => model.id) : []
      return { hosts: [channel.host], paths: channel.sharedHost && channel.basePath !== '' ? [channel.basePath] : [], models }
    }

    /** The channel a logged request went through: the longest base path on its host, and among equal ones the channel that lists its model. */
    function channelOfRequest(channels, entry) {
      const candidates = channels.filter(channel => channel.host === entry.host && entry.path.startsWith(channel.basePath))
      if (candidates.length === 0) return undefined
      const longest = Math.max(...candidates.map(channel => channel.basePath.length))
      const best = candidates.filter(channel => channel.basePath.length === longest)
      return best.find(channel => channel.models.some(model => model.id === entry.model)) ?? best[0]
    }

    /** The name a rule shows on a channel's page: its own name without the channel suffix new rules get, or its kind. */
    function displayName(t, rule, channel) {
      if (rule.name === '') return rule.preset === undefined ? t('preset.custom.name') : t(`preset.${rule.preset.id}.name`)
      const suffix = channel === undefined ? '' : ` · ${channel.name}`
      return suffix !== '' && rule.name.endsWith(suffix) && rule.name.length > suffix.length ? rule.name.slice(0, -suffix.length) : rule.name
    }

    /** A provider slug in words: `deepinfra/fp4` becomes `DeepInfra/fp4` when the catalog names `deepinfra`. */
    function providerLabel(names, slug) {
      const at = slug.indexOf('/')
      const name = names[at < 0 ? slug : slug.slice(0, at)]
      return name === undefined ? slug : at < 0 ? name : `${name}${slug.slice(at)}`
    }

    /** A one-line account of what a rule adds, for its collapsed card. */
    function summaryOf(t, rule, names) {
      const sep = t('listSeparator')
      const form = rule.preset?.form
      const parts = []
      if (rule.preset?.id === 'openrouter-routing') {
        const label = slug => providerLabel(names, slug)
        if (form.order.length > 0) parts.push(`${form.order.map(label).join(' → ')}${form.allowFallbacks ? '' : ` · ${t('sum.strict')}`}`)
        if (form.only.length > 0) parts.push(t('sum.only', { list: form.only.map(label).join(sep) }))
        if (form.ignore.length > 0) parts.push(t('sum.ignore', { list: form.ignore.map(label).join(sep) }))
        if (form.sort !== '') parts.push(t(`sum.sort.${form.sort}`))
        if (form.zdr) parts.push(t('sum.zdr'))
        if (form.dataCollection === 'deny') parts.push(t('sum.deny'))
        if (form.models.length > 0) parts.push(pl(t, 'sum.fallbackModels', form.models.length))
        const limits = [form.requireParameters, form.quantizations.length > 0, filled(form.maxPrompt) || filled(form.maxCompletion), filled(form.minThroughput), filled(form.maxLatency), form.distillable].filter(Boolean).length
        if (limits > 0) parts.push(pl(t, 'sum.limits', limits))
      } else if (rule.preset?.id === 'reasoning') {
        if (form.effort !== '') parts.push(t('sum.effort', { effort: form.effort }))
        if (filled(form.maxTokens)) parts.push(t('sum.budget', { n: form.maxTokens }))
        if (form.exclude) parts.push(t('sum.exclude'))
      } else {
        const scalar = value => value === null || ['string', 'number', 'boolean'].includes(typeof value)
        for (const [key, value] of Object.entries(rule.body.merge)) parts.push(scalar(value) ? `${key} = ${JSON.stringify(value)}` : key)
        for (const key of Object.keys(rule.body.defaults)) parts.push(`${key}?`)
        for (const path of rule.body.remove) parts.push(`−${path}`)
        for (const name of Object.keys(rule.headers.set)) parts.push(name)
        for (const name of rule.headers.remove) parts.push(`−${name}`)
      }
      return parts.length === 0 ? t('sum.empty') : parts.join(' · ')
    }

    /** The top-level body fields a dry run set or filled in, with their values after the rules. */
    function addedFields(result) {
      const keys = [...new Set(result.changes.filter(change => change.kind === 'set' || change.kind === 'default').map(change => change.path.split('.')[0]))]
      return Object.fromEntries(keys.map(key => [key, result.body[key]]))
    }

    /** The path a channel's model requests go to: the one a logged request used, or the usual endpoint under its base path. */
    function requestPathOf(channel, entries) {
      if (entries.length > 0) return entries[0].path
      return `${channel.basePath}${/\/anthropic$/.test(channel.basePath) ? '/v1/messages' : '/chat/completions'}`
    }

    const ICONS = {
      plus: ['M8 3.5v9M3.5 8h9'],
      more: [{ c: [3.5, 8, 0.9] }, { c: [8, 8, 0.9] }, { c: [12.5, 8, 0.9] }],
      chevron: ['M6 3.5 10.5 8 6 12.5'],
      up: ['M8 12.5v-9M4.5 7 8 3.5 11.5 7'],
      down: ['M8 3.5v9M4.5 9 8 12.5 11.5 9'],
      x: ['M4.5 4.5l7 7M11.5 4.5l-7 7'],
      route: ['M2.5 8H6', 'M6 8c2.2 0 2.3-4 5-4h2.5', 'M6 8c2.2 0 2.3 4 5 4h2.5', 'M11.8 2.4 13.5 4l-1.7 1.6', 'M11.8 10.4l1.7 1.6-1.7 1.6'],
      bulb: ['M8 2.5a3.8 3.8 0 0 0-2.3 6.8c.5.4.8.9.8 1.5v.7h3v-.7c0-.6.3-1.1.8-1.5A3.8 3.8 0 0 0 8 2.5z', 'M6.5 13.5h3'],
      sliders: ['M2.5 5h6.5M12 5h1.5M2.5 11h1.5M7 11h6.5', { c: [10.5, 5, 1.5] }, { c: [5.5, 11, 1.5] }],
      link: ['M6.8 9.2l2.4-2.4', 'M7.6 4.8l.9-.9a2.5 2.5 0 0 1 3.6 3.6l-.9.9', 'M8.4 11.2l-.9.9a2.5 2.5 0 0 1-3.6-3.6l.9-.9'],
      tag: ['M2.5 8.3V3.2c0-.4.3-.7.7-.7h5.1l5.2 5.2-5.8 5.8z', { c: [5.5, 5.5, 0.9] }],
      minus: [{ c: [8, 8, 5.5] }, 'M5.5 8h5'],
      braces: ['M6 2.5h-.8c-.7 0-1.2.5-1.2 1.2v2.5L2.8 8 4 9.8v2.5c0 .7.5 1.2 1.2 1.2H6', 'M10 2.5h.8c.7 0 1.2.5 1.2 1.2v2.5L13.2 8 12 9.8v2.5c0 .7-.5 1.2-1.2 1.2H10'],
      book: ['M3.5 3.5c0-.6.4-1 1-1h8v11h-8c-.6 0-1-.4-1-1z', 'M3.5 12.5c0-.6.4-1 1-1h8'],
      pulse: ['M2 8.5h2.5L6 4.5l3 7 1.5-3H14'],
      play: ['M5 3.6v8.8c0 .4.4.6.7.4l6.6-4.4c.3-.2.3-.6 0-.8L5.7 3.2c-.3-.2-.7 0-.7.4z'],
      globe: [{ c: [8, 8, 5.5] }, 'M2.5 8h11', 'M8 2.5c1.5 1.5 2.3 3.4 2.3 5.5S9.5 12 8 13.5', 'M8 2.5C6.5 4 5.7 5.9 5.7 8s.8 4 2.3 5.5'],
      server: ['M3 3h10v4.5H3zM3 8.5h10V13H3z', { c: [5.5, 5.25, 0.7] }, { c: [5.5, 10.75, 0.7] }],
    }

    function Icon({ name, size = 16 }) {
      return h('svg', { className: 'rp-icon', width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        ICONS[name].map((part, index) => (typeof part === 'string'
          ? h('path', { key: index, d: part })
          : h('circle', { key: index, cx: part.c[0], cy: part.c[1], r: part.c[2], ...part.c[2] < 1 ? { fill: 'currentColor', stroke: 'none' } : {} }))))
    }

    function SidebarIcon({ size }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'M2 4h5M10 4h4M2 8h2M7 8h7M2 12h6M11 12h3' }),
        h('circle', { cx: 8.5, cy: 4, r: 1.5 }),
        h('circle', { cx: 5.5, cy: 8, r: 1.5 }),
        h('circle', { cx: 9.5, cy: 12, r: 1.5 }))
    }

    function Switch({ checked, onChange, label, disabled }) {
      return h('button', { type: 'button', role: 'switch', className: 'rp-switch', 'aria-checked': checked, 'aria-label': label, title: label, disabled, onClick: () => onChange(!checked) })
    }

    function Seg({ value, options, onChange, label }) {
      return h('div', { className: 'rp-seg', role: 'radiogroup', 'aria-label': label, onKeyDown: radioKeys },
        options.map(option => h('button', {
          key: option.value, type: 'button', role: 'radio', 'aria-checked': option.value === value, tabIndex: option.value === value ? 0 : -1, disabled: option.disabled, onClick: () => onChange(option.value),
        }, option.label)))
    }

    /** A confirmation shown in place: the question, Cancel, and the action. */
    function ConfirmBox({ ui, text, action, danger, onCancel, onConfirm }) {
      return h('div', { className: 'rp-confirm', role: 'alertdialog', 'aria-label': action, onKeyDown: onEscape(onCancel) },
        h('div', null, text),
        h('div', { className: 'rp-bar rp-end' },
          h('button', { type: 'button', className: 'rp-btn', autoFocus: true, onClick: onCancel }, ui.t('cancel')),
          h('button', { type: 'button', className: `rp-btn ${danger ? 'is-danger' : 'is-primary'}`, onClick: onConfirm }, action)))
    }

    /** A button that opens a floating menu below it; a click elsewhere or Escape closes it and gives focus back to the button. */
    function Popover({ label, className, trigger, align = 'end', wide, children }) {
      const [open, setOpen] = React.useState(false)
      const root = React.useRef(null)
      const button = React.useRef(null)
      React.useEffect(() => {
        if (!open) return undefined
        const away = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }
        document.addEventListener('pointerdown', away)
        root.current?.querySelector('[role=menuitem]:not(:disabled)')?.focus({ preventScroll: true })
        return () => document.removeEventListener('pointerdown', away)
      }, [open])
      const close = () => {
        setOpen(false)
        button.current?.focus({ preventScroll: true })
      }
      return h('div', { className: 'rp-pop', ref: root },
        h('button', { ref: button, type: 'button', className, 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-label': label, title: label, onClick: () => setOpen(!open) }, trigger),
        open ? h('div', { className: `rp-popbody is-${align}${wide ? ' is-wide' : ''}`, role: 'menu', 'aria-label': label, onKeyDown: (event) => { menuKeys(event); onEscape(close)(event) } }, children(close)) : null)
    }

    function MenuItem({ close, onClick, danger, disabled, children }) {
      return h('button', { type: 'button', role: 'menuitem', className: `rp-menuitem${danger ? ' is-danger' : ''}`, disabled, onClick: () => { close(); onClick() } }, children)
    }

    /** One labelled row of a form: the label on the left (above it in a narrow page), the controls and an optional hint on the right. */
    function Row({ label, htmlFor, hint, children }) {
      return h(React.Fragment, null,
        h(htmlFor === undefined ? 'div' : 'label', { className: 'rp-rowlabel', htmlFor }, label),
        h('div', { className: 'rp-rowbody' }, children, hint === undefined || hint === null ? null : h('div', { className: 'rp-hint' }, hint)))
    }

    function Field({ label, hint, htmlFor, children }) {
      return h('div', { className: 'rp-field' },
        label === undefined ? null : h('label', { className: 'rp-label', htmlFor }, label),
        children,
        hint === undefined ? null : h('div', { className: 'rp-hint' }, hint))
    }

    function Check({ checked, onChange, children, hint }) {
      return h('label', { className: 'rp-check' },
        h('input', { type: 'checkbox', checked, onChange: event => onChange(event.target.checked) }),
        h('span', { className: 'rp-checktext' }, children, hint === undefined ? null : h('span', { className: 'rp-hint' }, hint)))
    }

    /** Free-text values as removable chips; Enter, comma, space, or leaving the field adds what was typed. */
    function ChipsInput({ ui, id, label, value, onChange, placeholder, listId, format }) {
      const [text, setText] = React.useState('')
      const input = React.useRef(null)
      const commit = (raw) => {
        const parts = raw.split(/[\s,，;；]+/).map(part => part.trim()).filter(part => part !== '')
        setText('')
        if (parts.length === 0) return
        const next = [...value]
        for (const part of parts) if (!next.includes(part)) next.push(part)
        if (next.length !== value.length) onChange(next)
      }
      return h('div', { className: 'rp-chips', onClick: () => input.current?.focus() },
        value.map((item, index) => h('span', { key: item, className: 'rp-chip' },
          h('span', { className: 'rp-chiptext rp-mono' }, format === undefined ? item : format(item)),
          h('button', { type: 'button', className: 'rp-chipx', 'aria-label': ui.t('removeItem', { item }), onClick: (event) => { event.stopPropagation(); onChange(value.filter((_, at) => at !== index)) } }, h(Icon, { name: 'x', size: 12 })))),
        h('input', {
          ref: input, id, className: 'rp-chipinput', value: text, list: listId, placeholder: value.length === 0 ? placeholder : '', 'aria-label': label, autoComplete: 'off', spellCheck: false,
          onChange: (event) => {
            const next = event.target.value
            if (/[\s,，;；]$/.test(next) && next.trim() !== '') commit(next)
            else setText(next)
          },
          onKeyDown: (event) => {
            if (event.nativeEvent.isComposing) return
            if (event.key === 'Enter' && text.trim() !== '') { event.preventDefault(); commit(text) }
            else if (event.key === 'Backspace' && text === '' && value.length > 0) onChange(value.slice(0, -1))
          },
          onBlur: () => commit(text),
        }))
    }

    /** Values whose order matters, as numbered rows with move and remove buttons; `render` draws an item. */
    function OrderItems({ ui, value, onChange, render }) {
      if (value.length === 0) return null
      const move = (from, to) => {
        const next = [...value]
        const [item] = next.splice(from, 1)
        next.splice(to, 0, item)
        onChange(next)
      }
      const small = 'rp-btn is-ghost is-sm is-icon'
      return h('ol', { className: 'rp-orderlist' }, value.map((item, index) => h('li', { key: item, className: 'rp-orderitem' },
        h('span', { className: 'rp-ordernum' }, index + 1),
        h('span', { className: 'rp-ordertext' }, render(item)),
        h('button', { type: 'button', className: small, disabled: index === 0, 'aria-label': ui.t('moveUpItem', { item }), title: ui.t('moveUpItem', { item }), onClick: () => move(index, index - 1) }, h(Icon, { name: 'up', size: 14 })),
        h('button', { type: 'button', className: small, disabled: index === value.length - 1, 'aria-label': ui.t('moveDownItem', { item }), title: ui.t('moveDownItem', { item }), onClick: () => move(index, index + 1) }, h(Icon, { name: 'down', size: 14 })),
        h('button', { type: 'button', className: small, 'aria-label': ui.t('removeItem', { item }), title: ui.t('removeItem', { item }), onClick: () => onChange(value.filter((_, at) => at !== index)) }, h(Icon, { name: 'x', size: 14 })))))
    }

    /** An ordered list of free-text values with a field to add one. */
    function OrderInput({ ui, id, label, value, onChange, placeholder, listId, onFocus }) {
      const [text, setText] = React.useState('')
      const add = () => {
        const next = text.trim()
        setText('')
        if (next !== '' && !value.includes(next)) onChange([...value, next])
      }
      return h(React.Fragment, null,
        h(OrderItems, { ui, value, onChange, render: item => h('span', { className: 'rp-mono' }, item) }),
        h('div', { className: 'rp-bar' },
          h('input', {
            id, className: 'rp-input rp-mono', value: text, list: listId, placeholder, 'aria-label': label, autoComplete: 'off', spellCheck: false, onFocus,
            onChange: event => setText(event.target.value),
            onKeyDown: (event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) { event.preventDefault(); add() } },
          }),
          h('button', { type: 'button', className: 'rp-btn', disabled: text.trim() === '', onClick: add }, ui.t('add'))))
    }

    /** A number typed as text, so a half-typed value is never rewritten under the cursor. */
    function NumberInput({ ui, id, value, onChange, placeholder, unit, integer, label }) {
      const raw = value === null || value === undefined ? '' : String(value)
      const bad = raw.trim() !== '' && !(integer ? /^\d+$/ : /^\d*\.?\d+$/).test(raw.trim())
      return h('div', { className: 'rp-unit' },
        h('input', { id, className: `rp-input${bad ? ' is-bad' : ''}`, inputMode: integer ? 'numeric' : 'decimal', value: raw, placeholder, 'aria-label': label, 'aria-invalid': bad || undefined, onChange: event => onChange(event.target.value) }),
        unit === undefined ? null : h('span', { className: 'rp-dim' }, unit),
        bad ? h('span', { className: 'rp-hint is-error' }, ui.t(integer ? 'badInteger' : 'badNumber')) : null)
    }

    /** A JSON object edited as text; the text is kept while it is not valid, and only a valid object is passed on. */
    function JsonField({ ui, id, value, onChange, rows = 6 }) {
      const [text, setText] = React.useState(() => pretty(value))
      const [error, setError] = React.useState(null)
      React.useEffect(() => {
        // The value changed from outside (a preset was rebuilt, an import was applied): show it, unless the text already says the same.
        try {
          if (same(JSON.parse(text), value)) return
        } catch {
          // The text is not valid JSON, so it cannot be the same as the value.
        }
        if (document.activeElement?.id !== id) {
          setText(pretty(value))
          setError(null)
        }
      }, [value])
      return h(React.Fragment, null,
        h('textarea', {
          id, className: `rp-input rp-textarea${error === null ? '' : ' is-bad'}`, rows, value: text, spellCheck: false, 'aria-invalid': error !== null || undefined,
          onChange: (event) => {
            const next = event.target.value
            setText(next)
            if (next.trim() === '') { setError(null); onChange({}); return }
            try {
              const parsed = JSON.parse(next)
              if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(ui.t('jsonNeedsObject'))
              setError(null)
              onChange(parsed)
            } catch (failure) {
              setError(failure.message)
            }
          },
        }),
        error === null ? null : h('div', { className: 'rp-hint is-error', role: 'alert' }, ui.t('jsonInvalid', { reason: error })))
    }

    /** JSON indented like `pretty`, except that a short array of plain values stays on one line. */
    function compactJson(value, indent = '') {
      const inner = `${indent}  `
      if (Array.isArray(value)) {
        const flat = `[${value.map(item => JSON.stringify(item)).join(', ')}]`
        if (value.every(item => item === null || typeof item !== 'object') && flat.length <= 60) return flat
        return value.length === 0 ? '[]' : `[\n${value.map(item => `${inner}${compactJson(item, inner)}`).join(',\n')}\n${indent}]`
      }
      if (value !== null && typeof value === 'object') {
        const entries = Object.entries(value)
        return entries.length === 0 ? '{}' : `{\n${entries.map(([key, item]) => `${inner}${JSON.stringify(key)}: ${compactJson(item, inner)}`).join(',\n')}\n${indent}}`
      }
      return JSON.stringify(value)
    }

    /** JSON with keys, strings, and numbers told apart. */
    function JsonView({ value }) {
      const text = compactJson(value)
      const parts = []
      const token = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g
      let last = 0
      let match
      while ((match = token.exec(text)) !== null) {
        if (match.index > last) parts.push(text.slice(last, match.index))
        if (match[1] !== undefined) parts.push(h('span', { key: match.index, className: match[2] === undefined ? 'rp-js' : 'rp-jk' }, match[1]), match[2] ?? '')
        else parts.push(h('span', { key: match.index, className: 'rp-jn' }, match[3] ?? match[4]))
        last = token.lastIndex
      }
      parts.push(text.slice(last))
      return h('pre', { className: 'rp-code' }, parts)
    }

    function priceText(endpoint) {
      const money = value => (value === null ? '–' : `$${value < 0.1 ? value.toPrecision(2) : value.toFixed(2)}`)
      return `${money(endpoint.prompt)} / ${money(endpoint.completion)}`
    }

    /**
     * A search field for OpenRouter providers. Its list shows first the providers that serve `model`, with price and
     * uptime, then every provider; Enter or a click adds one, and Enter on text that matches none adds the text as typed,
     * so a variant slug such as deepinfra/fp4 can be given. With `chips`, the chosen providers sit in the field as chips.
     */
    function ProviderPicker({ ui, id, placeholder, providers, model, chosen, onPick, chips }) {
      const { t } = ui
      const [text, setText] = React.useState('')
      const [open, setOpen] = React.useState(false)
      const [active, setActive] = React.useState(-1)
      const [served, setServed] = React.useState(null)
      const list = React.useRef(null)
      const input = React.useRef(null)
      const forModel = typeof model === 'string' && OR_MODEL.test(model)
      React.useEffect(() => {
        if (!open || !forModel) return undefined
        let alive = true
        loadCatalog('orEndpoints', { model }).then(value => { if (alive) setServed({ model, value }) }, () => { if (alive) setServed({ model, value: null }) })
        return () => { alive = false }
      }, [open, model])
      const servedNow = served?.model === model ? served.value : undefined
      const query = text.trim().toLowerCase()
      const hit = (...fields) => query === '' || fields.some(field => typeof field === 'string' && field.toLowerCase().includes(query))
      const modelItems = forModel && servedNow ? servedNow.endpoints.filter(endpoint => hit(endpoint.tag, endpoint.provider)).map(endpoint => ({ slug: endpoint.tag, name: endpoint.provider, meta: `${priceText(endpoint)}${endpoint.uptime === null ? '' : ` · ${endpoint.uptime.toFixed(0)}%`}` })) : []
      const allItems = (providers?.providers ?? []).filter(item => hit(item.slug, item.name) && !modelItems.some(other => other.slug === item.slug)).slice(0, 80).map(item => ({ slug: item.slug, name: item.name }))
      const items = [...modelItems, ...allItems]
      const raw = text.trim()
      const offerText = raw !== '' && !items.some(item => item.slug === raw)
      const pick = (slug) => {
        if (!chosen.includes(slug)) onPick(slug)
        setText('')
        setActive(-1)
      }
      React.useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }) }, [active])
      const option = (item, index) => h('div', {
        key: item.slug, id: `${id}-o${index}`, role: 'option', 'aria-selected': index === active, className: `rp-option${chosen.includes(item.slug) ? ' is-added' : ''}`,
        onMouseEnter: () => setActive(index), onClick: () => pick(item.slug),
      },
        h('span', { className: 'rp-optiontext' }, h('span', null, item.name), h('span', { className: 'rp-slug' }, item.slug)),
        chosen.includes(item.slug) ? h('span', { className: 'rp-optionmeta' }, t('picker.added')) : item.meta === undefined ? null : h('span', { className: 'rp-optionmeta', title: t('picker.priceTitle') }, item.meta))
      const field = h('input', {
        ref: input, id, className: chips === undefined ? 'rp-input' : 'rp-chipinput', value: text, placeholder: chips !== undefined && chips.items.length > 0 ? '' : placeholder, autoComplete: 'off', spellCheck: false,
        role: 'combobox', 'aria-expanded': open, 'aria-controls': `${id}-list`, 'aria-autocomplete': 'list', 'aria-activedescendant': open && active >= 0 ? `${id}-o${active}` : undefined,
        onFocus: () => setOpen(true),
        onBlur: () => { setOpen(false); setActive(-1) },
        onChange: (event) => { setText(event.target.value); setActive(-1); setOpen(true) },
        onKeyDown: (event) => {
          if (event.nativeEvent.isComposing) return
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
            if (items.length > 0) setActive(current => (event.key === 'ArrowDown' ? Math.min(current + 1, items.length - 1) : Math.max(current - 1, 0)))
          } else if (event.key === 'Enter') {
            event.preventDefault()
            if (active >= 0 && items[active] !== undefined) pick(items[active].slug)
            else if (raw !== '') pick(raw)
          } else if (event.key === 'Escape' && open) {
            event.preventDefault()
            event.stopPropagation()
            setOpen(false)
          } else if (event.key === 'Backspace' && text === '' && chips !== undefined && chips.items.length > 0) {
            chips.onRemove(chips.items.length - 1)
          }
        },
      })
      return h('div', { className: 'rp-picker' },
        chips === undefined ? field : h('div', { className: 'rp-chips', onClick: () => input.current?.focus() },
          chips.items.map((item, index) => h('span', { key: item, className: 'rp-chip' },
            h('span', { className: 'rp-chiptext' }, chips.label(item)),
            h('button', { type: 'button', className: 'rp-chipx', 'aria-label': t('removeItem', { item }), onClick: (event) => { event.stopPropagation(); chips.onRemove(index) } }, h(Icon, { name: 'x', size: 12 })))),
          field),
        open ? h('div', { className: 'rp-pickerlist', role: 'listbox', id: `${id}-list`, ref: list, onMouseDown: event => event.preventDefault() },
          forModel ? h('div', { className: 'rp-menulabel' }, t('picker.forModel', { model })) : null,
          forModel && servedNow === undefined ? h('div', { className: 'rp-menulabel' }, t('picker.loading')) : null,
          forModel && servedNow?.stale ? h('div', { className: 'rp-menulabel' }, t('picker.stale')) : null,
          modelItems.map((item, index) => option(item, index)),
          allItems.length === 0 ? null : h('div', { className: 'rp-menulabel' }, t('picker.all')),
          allItems.map((item, index) => option(item, modelItems.length + index)),
          offerText ? h('div', { className: 'rp-option', onClick: () => pick(raw) }, h('span', { className: 'rp-optiontext' }, t('picker.useText', { text: raw }))) : null,
          items.length === 0 && !offerText ? h('div', { className: 'rp-menulabel' }, t('picker.none')) : null) : null)
    }

    const QUANTIZATIONS = ['int4', 'int8', 'fp4', 'mxfp4', 'nvfp4', 'fp6', 'fp8', 'mxfp8', 'fp16', 'bf16', 'fp32', 'unknown']
    const EFFORTS = ['xhigh', 'high', 'medium', 'low', 'minimal', 'none']

    function RoutingForm({ ui, rule, form, set, model, providers }) {
      const { t } = ui
      const [models, wantModels] = useModels()
      const [more, setMore] = React.useState(() => form.only.length > 0 || form.requireParameters || form.quantizations.length > 0 || filled(form.maxPrompt) || filled(form.maxCompletion) || filled(form.minThroughput) || filled(form.maxLatency) || form.distillable)
      const names = React.useMemo(() => Object.fromEntries((providers?.providers ?? []).map(item => [item.slug, item.name])), [providers])
      const label = slug => providerLabel(names, slug)
      const idp = suffix => `rp-${rule.id}-${suffix}`
      const toggle = (key, value) => set({ [key]: form[key].includes(value) ? form[key].filter(item => item !== value) : [...form[key], value] })
      const providerChips = key => ({ items: form[key], label, onRemove: index => set({ [key]: form[key].filter((_, at) => at !== index) }) })
      const noTraffic = rule.match.hosts.some(host => host.endsWith('openrouter.ai')) && !ui.endpoints.some(endpoint => endpoint.host.endsWith('openrouter.ai')) && !ui.channels.some(channel => channel.openrouter)
      const forModel = typeof model === 'string' && OR_MODEL.test(model)
      const listed = form.order.length > 0 || form.only.length > 0
      const [served, setServed] = React.useState(null)
      React.useEffect(() => {
        if (!forModel || !listed) return undefined
        let alive = true
        loadCatalog('orEndpoints', { model }).then(value => { if (alive) setServed({ model, tags: value.endpoints.map(endpoint => endpoint.tag) }) }, () => { if (alive) setServed(null) })
        return () => { alive = false }
      }, [model, forModel, listed])
      const tags = forModel && served?.model === model ? served.tags : undefined
      // A slug without a variant covers every variant of that provider.
      const serves = slug => tags === undefined || tags.some(tag => tag === slug || tag.startsWith(`${slug}/`))
      const strict = form.only.length > 0 ? form.only : form.allowFallbacks ? [] : form.order
      let reach = null
      if (strict.length > 0 && !strict.some(serves)) reach = h('div', { className: 'rp-note is-warn', role: 'status' }, t('route.noneServe', { model }))
      else if (form.order.length > 0 && !form.order.some(serves)) reach = h('div', { className: 'rp-hint is-warn' }, t('route.noneServeFallback', { model }))
      return h('div', { className: 'rp-rows' },
        h('datalist', { id: idp('ormodels') }, (models?.models ?? []).slice(0, 800).map(item => h('option', { key: item.id, value: item.id }, item.name))),
        providers?.source === 'bundled' ? h('div', { className: 'rp-rowfull rp-hint is-warn' }, t('route.bundled', { date: providers.asOf })) : null,
        noTraffic ? h('div', { className: 'rp-rowfull rp-note' }, t('route.noTraffic')) : null,
        h(Row, { label: t('route.providers'), htmlFor: idp('order'), hint: form.order.length === 0 ? t('route.providersHint') : null },
          h(OrderItems, { ui, value: form.order, onChange: order => set({ order }), render: slug => [h('span', { key: 'n' }, label(slug)), label(slug) === slug ? null : h('span', { key: 's', className: 'rp-slug' }, slug), serves(slug) ? null : h('span', { key: 'w', className: 'rp-badge is-warn', title: t('route.notServingTitle', { model }) }, t('route.notServing'))] }),
          h(ProviderPicker, { ui, id: idp('order'), placeholder: t('route.search'), providers, model, chosen: form.order, onPick: slug => set({ order: [...form.order, slug] }) }),
          reach),
        form.order.length === 0 ? null : h(Row, { label: t('route.others'), hint: t('route.othersHint') },
          h(Seg, { value: form.allowFallbacks ? 'allow' : 'deny', label: t('route.others'), onChange: value => set({ allowFallbacks: value === 'allow' }), options: [{ value: 'allow', label: t('route.othersAllow') }, { value: 'deny', label: t('route.othersDeny') }] })),
        h(Row, { label: t('route.ignore'), htmlFor: idp('ignore') },
          h(ProviderPicker, { ui, id: idp('ignore'), placeholder: t('route.ignoreSearch'), providers, model, chosen: form.ignore, onPick: slug => set({ ignore: [...form.ignore, slug] }), chips: providerChips('ignore') })),
        h(Row, { label: t('route.sort') },
          h(Seg, { value: form.sort, label: t('route.sort'), onChange: sort => set({ sort }), options: [{ value: '', label: t('route.sortDefault') }, { value: 'price', label: t('route.sortPrice') }, { value: 'throughput', label: t('route.sortThroughput') }, { value: 'latency', label: t('route.sortLatency') }] })),
        h(Row, { label: t('route.data') },
          h('div', { className: 'rp-checks' },
            h(Check, { checked: form.zdr, onChange: zdr => set({ zdr }), hint: t('route.zdrHint') }, t('route.zdr')),
            h(Check, { checked: form.dataCollection === 'deny', onChange: deny => set({ dataCollection: deny ? 'deny' : '' }), hint: t('route.denyHint') }, t('route.deny')))),
        h(Row, { label: t('route.models'), htmlFor: idp('fallback'), hint: t('route.modelsHint') },
          h(OrderInput, { ui, id: idp('fallback'), label: t('route.models'), value: form.models, onChange: list => set({ models: list }), placeholder: 'anthropic/claude-sonnet-4.5', listId: idp('ormodels'), onFocus: wantModels })),
        h('div', { className: 'rp-rowfull' },
          h('button', { type: 'button', className: 'rp-link', 'aria-expanded': more, onClick: () => setMore(!more) }, h(Icon, { name: 'chevron', size: 12 }), more ? t('route.less') : t('route.more'))),
        more ? h(React.Fragment, null,
          h(Row, { label: t('route.only'), htmlFor: idp('only'), hint: t('route.onlyHint') },
            h(ProviderPicker, { ui, id: idp('only'), placeholder: t('route.onlySearch'), providers, model, chosen: form.only, onPick: slug => set({ only: [...form.only, slug] }), chips: providerChips('only') })),
          h(Row, { label: t('route.require') },
            h('div', { className: 'rp-checks' }, h(Check, { checked: form.requireParameters, onChange: requireParameters => set({ requireParameters }), hint: t('route.requireHint') }, t('route.requireLabel')))),
          h(Row, { label: t('route.quant'), hint: t('route.quantHint') },
            h('div', { className: 'rp-toggles' }, QUANTIZATIONS.map(item => h('button', { key: item, type: 'button', className: 'rp-toggle', 'aria-pressed': form.quantizations.includes(item), onClick: () => toggle('quantizations', item) }, item)))),
          h(Row, { label: t('route.maxPrice'), hint: t('route.perMillion') },
            h('div', { className: 'rp-pair' },
              h('span', { className: 'rp-paired' }, h('span', { className: 'rp-dim' }, t('route.input')), h(NumberInput, { ui, id: idp('max-prompt'), label: `${t('route.maxPrice')} · ${t('route.input')}`, value: form.maxPrompt, onChange: maxPrompt => set({ maxPrompt }) })),
              h('span', { className: 'rp-paired' }, h('span', { className: 'rp-dim' }, t('route.output')), h(NumberInput, { ui, id: idp('max-completion'), label: `${t('route.maxPrice')} · ${t('route.output')}`, value: form.maxCompletion, onChange: maxCompletion => set({ maxCompletion }) })))),
          h(Row, { label: t('route.speed'), hint: t('route.perfHint') },
            h('div', { className: 'rp-pair' },
              h('span', { className: 'rp-paired' }, h('span', { className: 'rp-dim' }, t('route.minThroughput')), h(NumberInput, { ui, id: idp('min-throughput'), label: t('route.minThroughput'), value: form.minThroughput, onChange: minThroughput => set({ minThroughput }), unit: 'tok/s' })),
              h('span', { className: 'rp-paired' }, h('span', { className: 'rp-dim' }, t('route.maxLatency')), h(NumberInput, { ui, id: idp('max-latency'), label: t('route.maxLatency'), value: form.maxLatency, onChange: maxLatency => set({ maxLatency }), unit: t('route.seconds') })))),
          h(Row, { label: t('route.distill') },
            h('div', { className: 'rp-checks' }, h(Check, { checked: form.distillable, onChange: distillable => set({ distillable }) }, t('route.distillable'))))) : null)
    }

    function ReasoningForm({ ui, rule, form, set }) {
      const { t } = ui
      return h('div', { className: 'rp-rows' },
        h(Row, { label: t('reasoning.effort'), hint: t('reasoning.effortHint') },
          h(Seg, { value: form.effort, label: t('reasoning.effort'), onChange: effort => set({ effort }), options: [{ value: '', label: t('notSet') }, ...EFFORTS.map(value => ({ value, label: value }))] })),
        h(Row, { label: t('reasoning.maxTokens'), htmlFor: `rp-${rule.id}-budget`, hint: t('reasoning.maxTokensHint') },
          h(NumberInput, { ui, id: `rp-${rule.id}-budget`, value: form.maxTokens, onChange: maxTokens => set({ maxTokens }), integer: true, unit: 'tokens' })),
        h(Row, { label: t('reasoning.output') },
          h('div', { className: 'rp-checks' }, h(Check, { checked: form.exclude, onChange: exclude => set({ exclude }), hint: t('reasoning.excludeHint') }, t('reasoning.exclude')))))
    }

    function SamplingForm({ ui, rule, form, set }) {
      const { t } = ui
      const fields = [['topK', 'sampling.topK', true], ['minP', 'sampling.minP', false], ['topA', 'sampling.topA', false], ['repetitionPenalty', 'sampling.repetition', false]]
      return h('div', { className: 'rp-rows' },
        fields.map(([key, label, integer]) => h(Row, { key, label: h('span', { className: 'rp-mono' }, t(label)), htmlFor: `rp-${rule.id}-${key}`, hint: t(`${label}Hint`) },
          h(NumberInput, { ui, id: `rp-${rule.id}-${key}`, value: form[key], onChange: value => set({ [key]: value }), integer }))))
    }

    function SessionForm({ ui, form, set }) {
      const { t } = ui
      return h('div', { className: 'rp-rows' },
        h(Row, { label: t('session.label') },
          h('div', { className: 'rp-checks' },
            h(Check, { checked: form.body, onChange: body => set({ body }), hint: t('session.bodyHint') }, t('session.body')),
            h(Check, { checked: form.header, onChange: header => set({ header }), hint: t('session.headerHint') }, t('session.header')))))
    }

    function AttributionForm({ ui, rule, form, set }) {
      const { t } = ui
      return h('div', { className: 'rp-rows' },
        h(Row, { label: t('attr.title'), htmlFor: `rp-${rule.id}-title`, hint: t('attr.titleHint') }, h('input', { id: `rp-${rule.id}-title`, className: 'rp-input', value: form.title, placeholder: 'My App', onChange: event => set({ title: event.target.value }) })),
        h(Row, { label: t('attr.referer'), htmlFor: `rp-${rule.id}-referer`, hint: t('attr.refererHint') }, h('input', { id: `rp-${rule.id}-referer`, className: 'rp-input', value: form.referer, placeholder: 'https://example.com', onChange: event => set({ referer: event.target.value }) })))
    }

    function StripForm({ ui, rule, form, set }) {
      const { t } = ui
      return h('div', { className: 'rp-rows' },
        h(Row, { label: t('strip.fields'), htmlFor: `rp-${rule.id}-strip`, hint: t('strip.hint') },
          h(ChipsInput, { ui, id: `rp-${rule.id}-strip`, label: t('strip.fields'), value: form.fields, onChange: fields => set({ fields }), placeholder: 'store' })),
        h(Row, { label: t('strip.common') },
          h('div', { className: 'rp-toggles' }, ['store', 'stream_options.include_usage', 'user', 'metadata'].map(item => h('button', { key: item, type: 'button', className: 'rp-toggle', 'aria-pressed': form.fields.includes(item), onClick: () => set({ fields: form.fields.includes(item) ? form.fields.filter(field => field !== item) : [...form.fields, item] }) }, item)))))
    }

    const FORMS = { 'openrouter-routing': RoutingForm, reasoning: ReasoningForm, sampling: SamplingForm, session: SessionForm, attribution: AttributionForm, strip: StripForm }
    const TYPE_ICON = { 'openrouter-routing': 'route', reasoning: 'bulb', sampling: 'sliders', session: 'link', attribution: 'tag', strip: 'minus', custom: 'braces' }
    const PRESET_ORDER = ['openrouter-routing', 'reasoning', 'sampling', 'session', 'attribution', 'strip', 'custom']
    /** The kinds whose fields only OpenRouter reads; a channel that is not OpenRouter does not offer them. */
    const OPENROUTER_ONLY = new Set(['openrouter-routing', 'reasoning', 'attribution'])
    /** Ready-made custom rules for other gateways; each field is one the gateway documents. */
    const RECIPES = {
      'vllm-thinking': { hosts: [], merge: { chat_template_kwargs: { enable_thinking: false } }, headers: {} },
      helicone: { hosts: ['*.helicone.ai'], merge: {}, headers: { 'Helicone-Auth': 'Bearer {{env:HELICONE_API_KEY}}', 'Helicone-Session-Id': '{{session}}', 'Helicone-Property-App': 'dsh' } },
      cloudflare: { hosts: ['gateway.ai.cloudflare.com'], merge: {}, headers: { 'cf-aig-cache-ttl': '3600', 'cf-aig-metadata': '{"session":"{{session}}"}' } },
      'openai-cache': { hosts: ['api.openai.com'], merge: { prompt_cache_key: '{{session}}' }, headers: {} },
    }
    const RECIPE_ORDER = Object.keys(RECIPES)

    /** The kinds of parameter a channel can get; with no channel (another address), every kind and recipe. */
    function choicesFor(channel) {
      if (channel === undefined) return { presets: PRESET_ORDER, recipes: RECIPE_ORDER }
      if (channel.openrouter) return { presets: PRESET_ORDER, recipes: [] }
      return { presets: ['custom', 'sampling', 'session', 'strip'], recipes: RECIPE_ORDER }
    }

    function problemText(t, problem) {
      return t(`problem.${problem.code}`, { detail: problem.detail ?? '' })
    }

    /** One header row per name/value pair, plus a blank row to type into. */
    function HeadersTable({ ui, value, onChange }) {
      const { t } = ui
      const [rows, setRows] = React.useState(() => Object.entries(value))
      React.useEffect(() => {
        const current = Object.fromEntries(rows.filter(([name]) => name.trim() !== ''))
        if (!same(current, value)) setRows(Object.entries(value))
      }, [value])
      const push = (next) => {
        setRows(next)
        onChange(Object.fromEntries(next.filter(([name]) => name.trim() !== '').map(([name, text]) => [name.trim(), text])))
      }
      return h('div', null,
        rows.map(([name, text], index) => h('div', { key: index, className: 'rp-headerrow' },
          h('input', { className: 'rp-input rp-mono', value: name, placeholder: 'X-Header', 'aria-label': t('headers.name'), autoComplete: 'off', spellCheck: false, onChange: event => push(rows.map((row, at) => (at === index ? [event.target.value, row[1]] : row))) }),
          h('input', { className: 'rp-input rp-mono', value: text, placeholder: t('headers.valuePlaceholder'), 'aria-label': t('headers.value'), autoComplete: 'off', spellCheck: false, onChange: event => push(rows.map((row, at) => (at === index ? [row[0], event.target.value] : row))) }),
          h('button', { type: 'button', className: 'rp-btn is-ghost is-icon', 'aria-label': t('headers.remove', { name: name || String(index + 1) }), onClick: () => push(rows.filter((_, at) => at !== index)) }, h(Icon, { name: 'x', size: 14 })))),
        h('button', { type: 'button', className: 'rp-btn is-sm', onClick: () => setRows([...rows, ['', '']]) }, h(Icon, { name: 'plus', size: 14 }), t('headers.add')))
    }

    function EnvStatus({ ui, env }) {
      const names = Object.keys(env)
      if (names.length === 0) return null
      return h('div', { className: 'rp-envs' }, names.map(name => h('span', { key: name, className: `rp-badge ${env[name] ? 'is-ok' : 'is-warn'}`, title: ui.t(env[name] ? 'env.set' : 'env.unset', { name }) }, `${env[name] ? '✓' : '!'} ${name}`)))
    }

    function CustomParams({ ui, rule, edit, env, idp }) {
      const { t } = ui
      const [more, setMore] = React.useState(() => Object.keys(rule.body.defaults).length > 0 || rule.body.remove.length > 0 || rule.headers.remove.length > 0 || rule.allowProtected)
      return h('div', { className: 'rp-rows' },
        h(Row, { label: t('custom.merge'), htmlFor: idp('merge'), hint: t('custom.mergeHint') },
          h(JsonField, { ui, id: idp('merge'), value: rule.body.merge, rows: 6, onChange: merge => edit((r) => { r.body.merge = merge }) })),
        h(Row, { label: t('custom.headers'), hint: t('custom.headersHint') },
          h(HeadersTable, { ui, value: rule.headers.set, onChange: set => edit((r) => { r.headers.set = set }) })),
        h('div', { className: 'rp-rowfull' },
          h('button', { type: 'button', className: 'rp-link', 'aria-expanded': more, onClick: () => setMore(!more) }, h(Icon, { name: 'chevron', size: 12 }), more ? t('custom.less') : t('custom.more'))),
        more ? h(React.Fragment, null,
          h(Row, { label: t('custom.defaults'), htmlFor: idp('defaults'), hint: t('custom.defaultsHint') },
            h(JsonField, { ui, id: idp('defaults'), value: rule.body.defaults, rows: 4, onChange: defaults => edit((r) => { r.body.defaults = defaults }) })),
          h(Row, { label: t('custom.remove'), htmlFor: idp('remove'), hint: t('custom.removeHint') },
            h(ChipsInput, { ui, id: idp('remove'), label: t('custom.remove'), value: rule.body.remove, placeholder: 'store', onChange: remove => edit((r) => { r.body.remove = remove }) })),
          h(Row, { label: t('custom.removeHeaders'), htmlFor: idp('remove-headers'), hint: t('custom.removeHeadersHint') },
            h(ChipsInput, { ui, id: idp('remove-headers'), label: t('custom.removeHeaders'), value: rule.headers.remove, placeholder: 'x-unwanted', onChange: remove => edit((r) => { r.headers.remove = remove.map(name => name.toLowerCase()) }) })),
          h(Row, { label: t('custom.protected') },
            h('div', { className: 'rp-checks' }, h(Check, { checked: rule.allowProtected, onChange: allowProtected => edit((r) => { r.allowProtected = allowProtected }), hint: t('custom.protectedHint', { fields: ui.limits.protectedBody.join(', ') }) }, t('custom.protectedLabel'))))) : null,
        h('div', { className: 'rp-rowfull rp-section' },
          h('div', { className: 'rp-hint' }, t('custom.templates')),
          h(EnvStatus, { ui, env })))
    }

    /** Where a rule applies, by host, path, and (for a rule outside every channel) model. */
    function MatchEditor({ ui, rule, edit, idp, models }) {
      const { t } = ui
      const usable = ui.channels.filter(channel => channel.host !== undefined)
      const hostSuggestions = [...new Set([...usable.map(channel => channel.host), 'openrouter.ai', ...ui.endpoints.map(endpoint => endpoint.host)])]
      const modelSuggestions = [...new Set([...ui.endpoints.flatMap(endpoint => endpoint.models), ...usable.flatMap(channel => channel.models.slice(0, 50).map(model => model.id))])]
      const addChannel = (id) => {
        const channel = usable.find(item => item.id === id)
        if (channel === undefined) return
        const wanted = matchOfChannel(channel)
        edit((r) => {
          for (const host of wanted.hosts) if (!r.match.hosts.includes(host)) r.match.hosts.push(host)
          for (const path of wanted.paths) if (!r.match.paths.includes(path)) r.match.paths.push(path)
        })
      }
      return h('div', { className: 'rp-subpanel' },
        h('div', { className: 'rp-subtitle' }, t('match.title')),
        h('div', { className: 'rp-rows' },
          h('datalist', { id: idp('hosts') }, hostSuggestions.map(host => h('option', { key: host, value: host }))),
          h('datalist', { id: idp('models') }, modelSuggestions.map(model => h('option', { key: model, value: model }))),
          h(Row, { label: t('match.hosts'), htmlFor: idp('hosts-input'), hint: t('match.hostsHint') },
            h(ChipsInput, { ui, id: idp('hosts-input'), label: t('match.hosts'), value: rule.match.hosts, listId: idp('hosts'), placeholder: 'openrouter.ai', onChange: hosts => edit((r) => { r.match.hosts = hosts }) }),
            usable.length === 0 ? null : h('select', { className: 'rp-input rp-select', value: '', 'aria-label': t('match.fromChannel'), onChange: event => addChannel(event.target.value) },
              h('option', { value: '' }, t('match.fromChannel')),
              usable.map(channel => h('option', { key: channel.id, value: channel.id }, `${channel.name} · ${channel.host}${channel.sharedHost ? channel.basePath : ''}`)))),
          models ? h(Row, { label: t('match.models'), htmlFor: idp('models-input'), hint: t('match.modelsHint') },
            h(ChipsInput, { ui, id: idp('models-input'), label: t('match.models'), value: rule.match.models, listId: idp('models'), placeholder: 'deepseek/*', onChange: list => edit((r) => { r.match.models = list }) })) : null,
          h(Row, { label: t('match.paths'), htmlFor: idp('paths-input'), hint: t('match.pathsHint') },
            h(ChipsInput, { ui, id: idp('paths-input'), label: t('match.paths'), value: rule.match.paths, placeholder: '/api/v1/chat', onChange: paths => edit((r) => { r.match.paths = paths }) }))))
    }

    /** Which of a channel's models a rule is for. */
    function ModelsScope({ ui, rule, edit, idp, channel }) {
      const { t } = ui
      return h('div', { className: 'rp-subpanel' },
        h('div', { className: 'rp-rows' },
          h('datalist', { id: idp('scope-models') }, channel.models.slice(0, 300).map(model => h('option', { key: model.id, value: model.id }, model.name))),
          h(Row, { label: t('card.scope'), htmlFor: idp('scope-input'), hint: t('card.scopeHint') },
            h(ChipsInput, { ui, id: idp('scope-input'), label: t('card.scope'), value: rule.match.models, listId: idp('scope-models'), placeholder: 'deepseek/*', onChange: models => edit((r) => { r.match.models = models }) }))))
    }

    /**
     * One parameter (a rule) as a card: its kind, name, and a one-line summary when closed, its form when open. On a
     * channel's page the card shows which models it is for; outside every channel it shows the hosts and paths it matches.
     */
    function ParamCard({ ui, rule, problems, open, channel, siblings, model, env, providers, names }) {
      const { t } = ui
      const [renaming, setRenaming] = React.useState(false)
      const [confirmJson, setConfirmJson] = React.useState(false)
      const [scopeOpen, setScopeOpen] = React.useState(false)
      const [matchOpen, setMatchOpen] = React.useState(false)
      const [noteOpen, setNoteOpen] = React.useState(false)
      const type = rule.preset?.id ?? 'custom'
      const Form = rule.preset === undefined ? undefined : FORMS[rule.preset.id]
      const name = displayName(t, rule, channel)
      const edit = change => ui.updateRule(rule.id, (current) => { change(current); return current })
      const idp = suffix => `rp-${rule.id}-${suffix}`
      const at = siblings.indexOf(rule.id)
      const blocking = rule.enabled && problems.length > 0
      const elsewhere = channel === undefined ? [] : ui.channels.filter(other => other.id !== channel.id && reaches(rule, other))
      const everywhere = rule.match.hosts.includes('*')
      const exact = rule.match.models.filter(pattern => !pattern.includes('*'))
      const formModel = exact.length === 1 ? exact[0] : model
      const misses = channel !== undefined && typeof model === 'string' && model !== '' && rule.match.models.length > 0 && !rule.match.models.some(pattern => modelMatches(pattern, model))
      const scopeText = rule.match.models.length === 0 ? t('card.allModels') : rule.match.models.length === 1 ? rule.match.models[0] : `${rule.match.models[0]} +${rule.match.models.length - 1}`
      const reveal = () => { if (!open) ui.toggleOpen(rule.id) }
      const typeIcon = h('span', { className: 'rp-typeicon' }, h(Icon, { name: TYPE_ICON[type] }))
      return h('section', { className: `rp-card${rule.enabled ? '' : ' is-off'}`, id: `rp-card-${rule.id}`, 'aria-label': name },
        h('div', { className: 'rp-cardhead' },
          renaming ? h(React.Fragment, null,
            typeIcon,
            h('input', {
              className: 'rp-input', autoFocus: true, value: rule.name, maxLength: ui.limits.name, placeholder: name, 'aria-label': t('card.name'),
              onChange: event => edit((r) => { r.name = event.target.value }),
              onKeyDown: (event) => { if ((event.key === 'Enter' || event.key === 'Escape') && !event.nativeEvent.isComposing) { event.preventDefault(); event.stopPropagation(); setRenaming(false) } },
              onBlur: () => setRenaming(false),
            })) : h('button', { type: 'button', className: 'rp-cardtoggle', 'aria-expanded': open, onClick: () => ui.toggleOpen(rule.id) },
            typeIcon,
            h('span', { className: 'rp-cardtitle' }, name),
            h('span', { className: 'rp-cardsum' }, open ? '' : summaryOf(t, rule, names)),
            h('span', { className: 'rp-chev' }, h(Icon, { name: 'chevron', size: 14 }))),
          channel === undefined ? null : h('button', {
            type: 'button', className: `rp-scope${rule.match.models.length > 0 ? ' is-set' : ''}${misses ? ' is-miss' : ''}`, title: misses ? t('card.notForModel') : t('card.scope'), 'aria-expanded': scopeOpen && open,
            onClick: () => { reveal(); setScopeOpen(!(scopeOpen && open)) },
          }, scopeText),
          blocking ? h('span', { className: 'rp-badge is-bad' }, pl(t, 'card.problems', problems.length)) : null,
          h(Switch, { checked: rule.enabled, label: t(rule.enabled ? 'card.disable' : 'card.enable', { name }), onChange: enabled => edit((r) => { r.enabled = enabled }) }),
          h(Popover, { label: t('more'), className: 'rp-btn is-ghost is-sm is-icon', trigger: h(Icon, { name: 'more' }) }, close => [
            h(MenuItem, { key: 'rename', close, onClick: () => setRenaming(true) }, t('card.rename')),
            channel === undefined ? null : h(MenuItem, { key: 'match', close, onClick: () => { reveal(); setMatchOpen(true) } }, t('card.editMatch')),
            rule.note !== undefined || noteOpen ? null : h(MenuItem, { key: 'note', close, onClick: () => { reveal(); setNoteOpen(true) } }, t('card.addNote')),
            h(MenuItem, { key: 'copy', close, onClick: () => ui.duplicateRule(rule.id) }, t('card.duplicate')),
            h('div', { key: 'sep1', className: 'rp-menusep', role: 'separator' }),
            h(MenuItem, { key: 'up', close, disabled: at <= 0, onClick: () => ui.swapRules(rule.id, siblings[at - 1]) }, t('card.moveUp')),
            h(MenuItem, { key: 'down', close, disabled: at < 0 || at >= siblings.length - 1, onClick: () => ui.swapRules(rule.id, siblings[at + 1]) }, t('card.moveDown')),
            rule.preset === undefined ? null : h(MenuItem, { key: 'json', close, onClick: () => { reveal(); setConfirmJson(true) } }, t('card.editJson')),
            h('div', { key: 'sep2', className: 'rp-menusep', role: 'separator' }),
            h(MenuItem, { key: 'delete', close, danger: true, onClick: () => ui.deleteRule(rule.id) }, t('card.delete')),
          ])),
        open ? h('div', { className: 'rp-cardbody' },
          problems.length === 0 ? null : h('div', { className: 'rp-note is-bad', role: 'alert' }, h('ul', { className: 'rp-problems' }, problems.map((problem, index) => h('li', { key: index }, problemText(t, problem))))),
          confirmJson ? h(ConfirmBox, { ui, text: t('card.confirmJson'), action: t('card.editJson'), onCancel: () => setConfirmJson(false), onConfirm: () => { setConfirmJson(false); edit((r) => { delete r.preset }) } }) : null,
          channel !== undefined && (everywhere || elsewhere.length > 0) ? h('div', { className: 'rp-note' }, everywhere ? t('card.everywhere') : t('card.alsoFor', { names: elsewhere.map(other => other.name).join(t('listSeparator')) })) : null,
          channel === undefined || matchOpen ? h(MatchEditor, { ui, rule, edit, idp, models: channel === undefined }) : null,
          channel !== undefined && scopeOpen ? h(ModelsScope, { ui, rule, edit, idp, channel }) : null,
          Form === undefined ? h(CustomParams, { ui, rule, edit, env, idp }) : h(Form, { ui, rule, form: rule.preset.form, set: patch => ui.setForm(rule.id, patch), model: formModel, providers }),
          rule.note !== undefined || noteOpen ? h('div', { className: 'rp-rows' },
            h(Row, { label: t('card.note'), htmlFor: idp('note') },
              h('input', { id: idp('note'), className: 'rp-input', value: rule.note ?? '', maxLength: ui.limits.note, placeholder: t('card.notePlaceholder'), onChange: event => edit((r) => { if (event.target.value === '') delete r.note; else r.note = event.target.value }) }))) : null) : null)
    }

    /** The kinds of parameter to add, as tiles on an empty page or as items of the Add menu. */
    function AddChoices({ ui, channel, onPick, tiles }) {
      const { t } = ui
      const { presets, recipes } = choicesFor(channel)
      const entry = (id, key, icon) => {
        const content = [
          h('span', { key: 'icon', className: 'rp-typeicon' }, h(Icon, { name: icon })),
          h('span', { key: 'text', className: 'rp-tiletext' },
            h('span', { className: 'rp-tilename' }, t(`${key}.name`), channel === undefined && OPENROUTER_ONLY.has(id) ? h('span', { className: 'rp-badge' }, t('add.openrouter')) : null),
            h('span', { className: 'rp-tiledesc' }, t(`${key}.desc`)))]
        return tiles
          ? h('button', { key: id, type: 'button', className: 'rp-tile', onClick: () => onPick(id) }, content)
          : h('button', { key: id, type: 'button', role: 'menuitem', className: 'rp-menuitem', onClick: () => onPick(id) }, content)
      }
      const presetItems = presets.map(id => entry(id, `preset.${id}`, TYPE_ICON[id]))
      const recipeItems = recipes.map(id => entry(`recipe:${id}`, `recipe.${id}`, 'book'))
      if (tiles) {
        return h(React.Fragment, null,
          h('div', { className: 'rp-tiles' }, presetItems),
          recipeItems.length === 0 ? null : h('div', { className: 'rp-grouplabel' }, t('add.recipes')),
          recipeItems.length === 0 ? null : h('div', { className: 'rp-tiles' }, recipeItems))
      }
      return h(React.Fragment, null, presetItems, recipeItems.length === 0 ? null : [
        h('div', { key: 'sep', className: 'rp-menusep', role: 'separator' }),
        h('div', { key: 'label', className: 'rp-menulabel' }, t('add.recipes')),
        ...recipeItems,
      ])
    }

    function AddMenu({ ui, channel, onPick }) {
      const { t } = ui
      return h(Popover, { label: t('detail.add'), className: 'rp-btn', trigger: [h(Icon, { key: 'i', name: 'plus', size: 14 }), h('span', { key: 't' }, t('detail.add'))], wide: true }, close => h(AddChoices, { ui, channel, onPick: (id) => { close(); onPick(id) } }))
    }

    /**
     * What the saved and unsaved parameters add to a request through one channel, worked out by the host's dry run on
     * a sample request for the chosen model. It is computed with the parameters switched on, and says so when they are paused.
     */
    function Preview({ ui, channel, path, model, setModel, options, dirty, enabled }) {
      const { t } = ui
      const [state, setState] = React.useState({ kind: 'loading' })
      const seq = React.useRef(0)
      const key = useDebounced(`${channel.id}\n${path}\n${model}\n${JSON.stringify(ui.draft.rules)}`, 250)
      React.useEffect(() => {
        const mine = ++seq.current
        const messages = [{ role: 'user', content: 'Hello' }]
        const body = /\/messages$/.test(path) ? { model, max_tokens: 1024, messages, stream: true } : { model, messages, stream: true }
        if (model === '') delete body.model
        ui.dryRun({ url: new URL(path, channel.baseURL).href, body, session: '', useDraft: true, enabled: true }).then(
          (result) => { if (mine === seq.current) setState({ kind: 'ok', result }) },
          (error) => { if (mine === seq.current) setState({ kind: 'error', error }) },
        )
      }, [key])
      const result = state.kind === 'ok' ? state.result : undefined
      const added = result === undefined ? {} : addedFields(result)
      const headers = result === undefined ? [] : [...Object.entries(result.headers.set).map(([name, value]) => ({ remove: false, text: `${name}: ${value}` })), ...result.headers.remove.map(name => ({ remove: true, text: name }))]
      const removals = result === undefined ? [] : [...new Set(result.matched.flatMap(match => ui.draft.rules.find(rule => rule.id === match.id)?.body.remove ?? []))]
      const nothing = result !== undefined && Object.keys(added).length === 0 && headers.length === 0 && removals.length === 0
      return h('section', { className: 'rp-preview', 'aria-label': t('preview.title') },
        h('div', { className: 'rp-previewhead' },
          h('span', { className: 'rp-previewtitle' }, t('preview.title')),
          dirty ? h('span', { className: 'rp-badge is-accent' }, t('preview.unsaved')) : null,
          h('span', { className: 'rp-grow' }),
          h('label', { className: 'rp-previewmodel' },
            h('span', null, t('preview.model')),
            h('input', { className: 'rp-input', list: `rp-pm-${channel.id}`, value: model, spellCheck: false, autoComplete: 'off', onChange: event => setModel(event.target.value.trim()) })),
          h('datalist', { id: `rp-pm-${channel.id}` }, options.map(option => h('option', { key: option, value: option })))),
        h('div', { className: 'rp-previewbody', 'aria-live': 'polite' },
          enabled ? null : h('div', { className: 'rp-note is-warn' }, t('preview.paused')),
          state.kind === 'error' ? h('div', { className: 'rp-hint is-error' }, t('preview.failed', { reason: ui.describe(state.error) })) : null,
          result === undefined && state.kind === 'loading' ? h('div', { className: 'rp-hint' }, t('preview.loading')) : null,
          nothing ? h('div', { className: 'rp-hint' }, result.matched.length === 0 && model !== '' ? t('preview.noneForModel') : t('preview.none')) : null,
          Object.keys(added).length > 0 ? h(JsonView, { value: added }) : null,
          headers.length === 0 ? null : h('div', { className: 'rp-lines' },
            h('div', { className: 'rp-label' }, t('preview.headers')),
            headers.map((line, index) => h('div', { key: index, className: `rp-line${line.remove ? ' is-remove' : ''}` }, h('span', { className: 'rp-sign' }, line.remove ? '−' : '+'), h('span', null, line.text)))),
          removals.length === 0 ? null : h('div', { className: 'rp-hint' }, t('preview.remove', { fields: removals.join(', ') })),
          result === undefined ? null : h(Notes, { ui, skipped: result.skipped, invalid: result.invalid, rules: ui.draft.rules })))
    }

    const SIGNS = { set: '+', default: '+', remove: '−', header: 'H', 'header-remove': 'H−' }

    function ChangeList({ ui, changes, more }) {
      const { t } = ui
      if (changes.length === 0) return null
      return h('ul', { className: 'rp-changes' },
        changes.map((change, index) => h('li', { key: index, className: `rp-change is-${change.kind}` },
          h('span', { className: 'rp-sign', 'aria-label': t(`change.${change.kind}`), title: t(`change.${change.kind}`) }, SIGNS[change.kind]),
          h('code', { className: 'rp-changepath' }, change.path),
          change.secret ? h('span', { className: 'rp-dim' }, t('change.secret')) : change.value === undefined ? null : h('code', { className: 'rp-changevalue' }, change.value))),
        more > 0 ? h('li', { className: 'rp-dim' }, t('change.more', { n: more })) : null)
    }

    function Notes({ ui, skipped, invalid, rules }) {
      const { t } = ui
      const nameOf = id => rules.find(rule => rule.id === id)?.name || t('card.unnamed')
      return h(React.Fragment, null,
        (skipped ?? []).map((item, index) => h('div', { key: `s${index}`, className: 'rp-note is-warn' }, t(`skipped.${item.reason}`, { name: item.detail, field: item.path, rule: nameOf(item.rule) }))),
        (invalid ?? []).map((item, index) => h('div', { key: `i${index}`, className: 'rp-note is-warn' }, t('invalid.rule', { rule: item.name || t('card.unnamed'), problems: item.codes.map(code => t(`problem.${code}`, { detail: '' }).replace(/[：:]\s*$/, '')).join(t('listSeparator')) }))))
    }

    /** Fields a rule set that the gateway's error text names as whole words. */
    function mentionedFields(entry) {
      if (entry.errorText === undefined || entry.errorText === '') return []
      const names = new Set(entry.changes.filter(change => change.kind !== 'remove' && change.kind !== 'header-remove').map(change => change.path.split('.')[0]).filter(name => name.length >= 3))
      return [...names].filter(name => new RegExp(`(?<![A-Za-z0-9_-])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_-])`, 'i').test(entry.errorText))
    }

    /** Logged requests, newest first; a row opens to what was added, what the gateway answered, and why it may have refused. */
    function RequestList({ ui, entries, rules, enabled, onPause, showWhere }) {
      const { t, lang } = ui
      const [open, setOpen] = React.useState(() => new Set())
      const toggle = id => setOpen((current) => {
        const next = new Set(current)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
      const now = Date.now()
      return h('div', { className: 'rp-reqs' }, entries.map((entry) => {
        const failed = entry.networkError !== undefined || (entry.status !== undefined && entry.status >= 400)
        const applied = entry.changes.length + (entry.moreChanges ?? 0)
        const isOpen = open.has(entry.id)
        let tag
        if (entry.failed !== undefined) tag = h('span', { className: 'rp-reqtag is-warn' }, t('req.notApplied'))
        else if (entry.paused) tag = h('span', { className: 'rp-reqtag is-warn' }, t('req.paused'))
        else if (entry.changed) tag = h('span', { className: 'rp-reqtag is-on' }, t('req.applied', { n: applied }))
        else if (entry.matched.length > 0) tag = h('span', { className: 'rp-reqtag' }, t('req.noChange'))
        else tag = h('span', { className: 'rp-reqtag' }, t('req.noMatch'))
        const status = entry.aborted === true ? t('req.aborted') : entry.networkError !== undefined ? t('req.networkError') : entry.status === undefined ? '…' : String(entry.status)
        const channel = channelOfRequest(ui.channels, entry)
        const mentions = mentionedFields(entry)
        return h('div', { key: entry.id, className: 'rp-req' },
          h('button', { type: 'button', className: 'rp-reqhead', 'aria-expanded': isOpen, onClick: () => toggle(entry.id) },
            h('span', { className: `rp-code-badge${failed ? ' is-bad' : entry.status === undefined ? '' : ' is-ok'}` }, status),
            h('span', { className: 'rp-reqmodel' }, entry.model ?? t('req.noModel')),
            h('span', { className: 'rp-reqwhere' }, showWhere ? (channel?.name ?? `${entry.host}${entry.path}`) : ''),
            tag,
            h('span', { className: 'rp-reqtime', title: clock(lang, entry.at) }, ago(lang, entry.at, now)),
            h('span', { className: 'rp-chev' }, h(Icon, { name: 'chevron', size: 14 }))),
          isOpen ? h('div', { className: 'rp-reqbody' },
            h('div', { className: 'rp-hint' }, `${entry.method} ${entry.host}${entry.path} · ${clock(lang, entry.at)}${entry.durationMs === undefined ? '' : ` · ${t('req.duration', { ms: entry.durationMs })}`}`),
            entry.matched.length === 0 ? null : h('div', { className: 'rp-hint' }, `${t('req.matched')}: ${entry.matched.map(match => match.name || t('card.unnamed')).join(t('listSeparator'))}`),
            entry.failed === undefined ? null : h('div', { className: 'rp-note is-warn', role: 'alert' }, t('req.failed', { reason: entry.failed })),
            h(ChangeList, { ui, changes: entry.changes, more: entry.moreChanges ?? 0 }),
            h(Notes, { ui, skipped: entry.skipped, invalid: entry.invalid, rules }),
            entry.networkError === undefined ? null : h('div', { className: 'rp-note is-warn', role: 'alert' }, t('req.networkDetail', { reason: entry.networkError })),
            entry.errorText === undefined || entry.errorText === '' ? null : h('div', { className: 'rp-section' }, h('div', { className: 'rp-label' }, t('req.errorText')), h('pre', { className: 'rp-pre' }, entry.errorText)),
            mentions.length === 0 ? null : h('div', { className: 'rp-note is-warn', role: 'status' }, t('req.mentions', { fields: mentions.join(', ') })),
            failed && entry.changed ? h('div', { className: 'rp-note' },
              h('span', { className: 'rp-grow' }, t('req.rejectedHint')),
              enabled ? h('button', { type: 'button', className: 'rp-btn is-sm', onClick: onPause }, t('req.pauseAll')) : null) : null) : null)
      }))
    }

    /** The empty state of a page that can take parameters: what it is, and the kinds to start from. */
    function EmptyAdd({ ui, title, body, channel, onPick }) {
      return h('div', { className: 'rp-empty' },
        h('div', { className: 'rp-emptyhead' },
          title === undefined ? null : h('div', { className: 'rp-emptytitle' }, title),
          h('div', { className: 'rp-hint' }, body)),
        h(AddChoices, { ui, channel, onPick, tiles: true }))
    }

    /** The cards of the parameters on one page, in the order they apply. */
    function CardList({ ui, rules, channel, problemsBy, openIds, model, env, providers, names }) {
      const siblings = rules.map(rule => rule.id)
      return h('div', { className: 'rp-cards' }, rules.map(rule => h(ParamCard, {
        key: rule.id, ui, rule, channel, siblings, model, env, providers, names,
        problems: problemsBy.get(rule.id) ?? [], open: openIds.includes(rule.id),
      })))
    }

    /** One configured channel: where it sends, what it adds (preview), its parameters, and its recent requests. */
    function ChannelDetail({ ui, channel, problemsBy, openIds, env, providers, names, recent, enabled, dirty, onPause }) {
      const { t } = ui
      const own = ui.draft.rules.filter(rule => reaches(rule, channel))
      const mine = recent.filter(entry => channelOfRequest(ui.channels, entry)?.id === channel.id)
      const exact = own.flatMap(rule => rule.match.models).filter(pattern => !pattern.includes('*'))
      const options = [...new Set([...mine.map(entry => entry.model).filter(model => typeof model === 'string'), ...exact, ...channel.models.map(model => model.id)])].slice(0, 300)
      // Without a model from requests or parameters, a DeepSeek model is the likeliest one to preview.
      const [model, setModel] = React.useState(() => (mine.length > 0 || exact.length > 0 ? options[0] : options.find(id => /^deepseek[/-]/i.test(id)) ?? options.find(id => /deepseek/i.test(id)) ?? options[0]) ?? '')
      const onPick = id => ui.addFromPreset(id, channel)
      return h('div', { className: 'rp-detail' },
        h('div', { className: 'rp-dhead' },
          h('div', { className: 'rp-grow' },
            h('h2', { className: 'rp-dtitle' }, channel.name),
            h('div', { className: 'rp-dsub' },
              channel.host === undefined ? null : h('span', { className: 'rp-url', title: t(`channels.source.${channel.source}`) }, `${channel.host}${channel.basePath}`),
              channel.name === channel.id ? null : h('span', null, channel.id),
              channel.modelCount === 0 ? null : h('span', null, pl(t, 'channels.models', channel.modelCount)))),
          own.length === 0 || channel.host === undefined ? null : h(AddMenu, { ui, channel, onPick })),
        channel.modelsError === undefined ? null : h('div', { className: 'rp-hint is-warn' }, t('channels.modelsError', { reason: channel.modelsError })),
        channel.host === undefined ? h('div', { className: 'rp-note' }, t('channels.noHost'))
          : own.length === 0 ? h(EmptyAdd, { ui, title: t('detail.emptyTitle'), body: t('detail.emptyBody'), channel, onPick })
            : h(React.Fragment, null,
              h(Preview, { ui, channel, path: requestPathOf(channel, mine), model, setModel, options, dirty, enabled }),
              h(CardList, { ui, rules: own, channel, problemsBy, openIds, model, env, providers, names }),
              own.length > 1 ? h('div', { className: 'rp-hint' }, t('card.order')) : null),
        channel.host === undefined ? null : h('section', { className: 'rp-section' },
          h('div', { className: 'rp-sectionhead' },
            h('span', { className: 'rp-sectiontitle' }, t('detail.recent')),
            h('span', { className: 'rp-grow' }),
            mine.length === 0 ? null : h('button', { type: 'button', className: 'rp-link', onClick: () => ui.select('requests') }, t('detail.allRequests'), h(Icon, { name: 'chevron', size: 12 }))),
          mine.length === 0 ? h('div', { className: 'rp-hint' }, t('detail.recentEmpty')) : h(RequestList, { ui, entries: mine.slice(0, CHANNEL_RECENT), rules: ui.draft.rules, enabled, onPause, showWhere: false })))
    }

    /** The parameters that reach no configured channel; each card names its own hosts, paths, and models. */
    function OtherDetail({ ui, rules, problemsBy, openIds, env, providers, names }) {
      const { t } = ui
      const onPick = id => ui.addFromPreset(id, undefined)
      return h('div', { className: 'rp-detail' },
        h('div', { className: 'rp-dhead' },
          h('div', { className: 'rp-grow' },
            h('h2', { className: 'rp-dtitle' }, t('nav.other')),
            h('div', { className: 'rp-dsub' }, t('detail.otherIntro'))),
          rules.length === 0 ? null : h(AddMenu, { ui, channel: undefined, onPick })),
        rules.length === 0 ? h(EmptyAdd, { ui, body: t('detail.otherEmpty'), channel: undefined, onPick })
          : h(CardList, { ui, rules, channel: undefined, problemsBy, openIds, model: undefined, env, providers, names }))
    }

    function RequestsView({ ui, recent, endpoints, rules, enabled, onClear, onPause }) {
      const { t } = ui
      const loose = endpoints.filter(endpoint => !ui.channels.some(channel => channel.host === endpoint.host && endpoint.path.startsWith(channel.basePath)))
      return h('div', { className: 'rp-detail' },
        h('div', { className: 'rp-dhead' },
          h('div', { className: 'rp-grow' },
            h('h2', { className: 'rp-dtitle' }, t('nav.requests')),
            h('div', { className: 'rp-dsub' }, t('req.intro'))),
          h('button', { type: 'button', className: 'rp-btn', disabled: recent.length === 0, onClick: onClear }, t('req.clear'))),
        loose.length === 0 ? null : h('section', { className: 'rp-section' },
          h('div', { className: 'rp-label' }, t('req.endpoints')),
          h('div', { className: 'rp-endpoints' }, loose.map(endpoint => h('div', { key: `${endpoint.host}${endpoint.path}`, className: 'rp-endpoint' },
            h('div', { className: 'rp-endpointmain' },
              h('span', { className: 'rp-url' }, `${endpoint.host}${endpoint.path}`),
              h('span', { className: 'rp-hint' }, `${pl(t, 'req.count', endpoint.count)}${endpoint.models.length === 0 ? '' : ` · ${endpoint.models.join(', ')}`}`)),
            h('button', { type: 'button', className: 'rp-btn is-sm', onClick: () => ui.ruleForEndpoint(endpoint) }, t('req.makeRule')))))),
        recent.length === 0 ? h('div', { className: 'rp-empty' }, h('div', { className: 'rp-emptyhead' }, h('div', { className: 'rp-emptytitle' }, t('req.emptyTitle')), h('div', { className: 'rp-hint' }, t('req.emptyHint'))))
          : h(RequestList, { ui, entries: recent, rules, enabled, onPause, showWhere: true }))
    }

    const SAMPLE_BODY = { model: 'deepseek/deepseek-chat', messages: [{ role: 'user', content: 'Hello' }], stream: true, store: false }
    const SAMPLE_URL = 'https://openrouter.ai/api/v1/chat/completions'
    const MAX_DIFF_LINES = 1500

    /**
     * Line diff of two pretty-printed JSON texts (longest common subsequence). A trailing comma is ignored when lines
     * are compared, so the field that used to be last does not show as changed when a field is added after it;
     * undefined when the texts are too long to compare here.
     */
    function lineDiff(before, after) {
      const a = before.split('\n')
      const b = after.split('\n')
      if (a.length > MAX_DIFF_LINES || b.length > MAX_DIFF_LINES) return undefined
      const bare = line => line.replace(/,$/, '')
      const table = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1))
      for (let i = a.length - 1; i >= 0; i--) {
        for (let j = b.length - 1; j >= 0; j--) table[i][j] = bare(a[i]) === bare(b[j]) ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
      }
      const out = []
      let i = 0
      let j = 0
      while (i < a.length && j < b.length) {
        if (bare(a[i]) === bare(b[j])) { out.push({ type: 'same', text: b[j] }); i++; j++ }
        else if (table[i + 1][j] >= table[i][j + 1]) out.push({ type: 'del', text: a[i++] })
        else out.push({ type: 'add', text: b[j++] })
      }
      while (i < a.length) out.push({ type: 'del', text: a[i++] })
      while (j < b.length) out.push({ type: 'add', text: b[j++] })
      return out
    }

    function DiffView({ ui, before, after }) {
      const { t } = ui
      const diff = lineDiff(pretty(before), pretty(after))
      if (diff === undefined) return h('pre', { className: 'rp-pre' }, pretty(after))
      return h('pre', { className: 'rp-pre rp-diff', 'aria-label': t('try.resultBody') },
        diff.map((line, index) => h('div', { key: index, className: `rp-diffline is-${line.type}` }, h('span', { className: 'rp-diffsign', 'aria-hidden': true }, line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' '), line.text)))
    }

    function TryView({ ui, dirty, rules, defaultUrl, defaultModel }) {
      const { t } = ui
      const [saved] = React.useState(() => readStored('sessionStorage', TRY_KEY, {}))
      const sampleText = () => pretty(defaultModel === undefined ? SAMPLE_BODY : { ...SAMPLE_BODY, model: defaultModel })
      const [url, setUrl] = React.useState(() => (typeof saved.url === 'string' ? saved.url : defaultUrl ?? SAMPLE_URL))
      const [text, setText] = React.useState(() => (typeof saved.text === 'string' ? saved.text : sampleText()))
      const [session, setSession] = React.useState(() => (typeof saved.session === 'string' ? saved.session : ''))
      const [useDraft, setUseDraft] = React.useState(true)
      const [state, setState] = React.useState({ kind: 'idle' })
      const seq = React.useRef(0)
      React.useEffect(() => { writeStored('sessionStorage', TRY_KEY, { url, text, session }) }, [url, text, session])
      const run = () => {
        let body
        try {
          body = JSON.parse(text)
        } catch (error) {
          setState({ kind: 'bad', reason: error.message })
          return
        }
        const mine = ++seq.current
        setState({ kind: 'loading' })
        ui.dryRun({ url: url.trim(), body, session, useDraft: dirty && useDraft }).then(
          result => { if (mine === seq.current) setState({ kind: 'ok', result, body }) },
          error => { if (mine === seq.current) setState({ kind: 'error', error }) },
        )
      }
      const result = state.kind === 'ok' ? state.result : undefined
      const resultRef = React.useRef(null)
      React.useEffect(() => { if (state.kind === 'ok') resultRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [state])
      const changedHeaders = result === undefined ? [] : [...Object.entries(result.headers.set).map(([name, value]) => `${name}: ${value}`), ...result.headers.remove.map(name => `${name}: ∅`)]
      return h('div', { className: 'rp-detail' },
        h('div', { className: 'rp-dhead' },
          h('div', { className: 'rp-grow' },
            h('h2', { className: 'rp-dtitle' }, t('nav.try')),
            h('div', { className: 'rp-dsub' }, t('try.intro')))),
        h('div', { className: 'rp-form' },
          h(Field, { label: t('try.url'), htmlFor: 'rp-try-url' }, h('input', { id: 'rp-try-url', className: 'rp-input rp-mono', value: url, spellCheck: false, onChange: event => setUrl(event.target.value) })),
          h(Field, { label: t('try.body'), hint: t('try.bodyHint'), htmlFor: 'rp-try-body' }, h('textarea', { id: 'rp-try-body', className: 'rp-input rp-textarea', rows: 9, value: text, spellCheck: false, onChange: event => setText(event.target.value) })),
          h(Field, { label: t('try.session'), hint: t('try.sessionHint'), htmlFor: 'rp-try-session' }, h('input', { id: 'rp-try-session', className: 'rp-input', value: session, placeholder: 'SESSION-ID', onChange: event => setSession(event.target.value) }))),
        h('div', { className: 'rp-bar' },
          h('button', { type: 'button', className: 'rp-btn is-primary', disabled: state.kind === 'loading' || url.trim() === '', onClick: run }, h(Icon, { name: 'play', size: 14 }), t('try.run')),
          h('button', { type: 'button', className: 'rp-btn', onClick: () => { setUrl(defaultUrl ?? SAMPLE_URL); setText(sampleText()); setState({ kind: 'idle' }) } }, t('try.reset')),
          dirty ? h(Check, { checked: useDraft, onChange: setUseDraft }, t('try.useDraft')) : null),
        state.kind === 'bad' ? h('div', { className: 'rp-note is-warn', role: 'alert' }, t('jsonInvalid', { reason: state.reason })) : null,
        state.kind === 'error' ? h('div', { className: 'rp-note is-warn', role: 'alert' }, ui.describe(state.error)) : null,
        result === undefined ? null : h('div', { className: 'rp-section', role: 'status', ref: resultRef },
          result.paused ? h('div', { className: 'rp-note' }, t('try.paused')) : null,
          !result.modelEndpoint && result.matched.length === 0 && rules.length > 0 ? h('div', { className: 'rp-note' }, t('try.notModelEndpoint')) : null,
          result.matched.length === 0 && !result.paused ? h('div', { className: 'rp-note' }, t('try.noMatch')) : h('div', { className: 'rp-hint' }, `${t('req.matched')}: ${result.matched.map(match => match.name || t('card.unnamed')).join(t('listSeparator'))}`),
          h(ChangeList, { ui, changes: result.changes.map(change => ({ ...change, value: change.value === undefined ? undefined : JSON.stringify(change.value) })), more: 0 }),
          h(Notes, { ui, skipped: result.skipped, invalid: result.invalid, rules }),
          result.changed ? null : h('div', { className: 'rp-hint' }, t('try.unchanged')),
          h('div', { className: 'rp-label' }, t('try.resultBody')),
          h(DiffView, { ui, before: state.body, after: result.body }),
          changedHeaders.length === 0 ? null : h('div', { className: 'rp-section' }, h('div', { className: 'rp-label' }, t('try.resultHeaders')), h('pre', { className: 'rp-pre' }, changedHeaders.join('\n')))))
    }

    function ImportPanel({ ui, hasRules, onApply, onClose }) {
      const { t } = ui
      const ref = usePanelFocus()
      const [text, setText] = React.useState('')
      const [state, setState] = React.useState({ kind: 'idle' })
      const [confirm, setConfirm] = React.useState(false)
      const read = (raw) => {
        let value
        try {
          value = JSON.parse(raw)
        } catch (error) {
          setState({ kind: 'bad', reason: error.message })
          return
        }
        const config = Array.isArray(value) ? { rules: value } : value
        setState({ kind: 'loading' })
        post('check', { config }).then(
          checked => setState(checked.config.rules.length === 0 ? { kind: 'empty' } : { kind: 'ok', checked }),
          error => setState({ kind: 'error', error }),
        )
      }
      return h('div', { className: 'rp-panel', ref, tabIndex: -1, role: 'group', 'aria-label': t('import.title'), onKeyDown: onEscape(onClose) },
        h('div', { className: 'rp-bar' }, h('strong', { className: 'rp-grow' }, t('import.title')), h('button', { type: 'button', className: 'rp-btn is-ghost is-icon', 'aria-label': t('close'), title: t('close'), onClick: onClose }, h(Icon, { name: 'x' }))),
        h('div', { className: 'rp-hint' }, t('import.hint')),
        h('textarea', { className: 'rp-input rp-textarea', rows: 7, value: text, placeholder: '{ "rules": [ … ] }', 'aria-label': t('import.title'), spellCheck: false, onChange: (event) => { setText(event.target.value); setState({ kind: 'idle' }) } }),
        h('div', { className: 'rp-bar' },
          h('button', { type: 'button', className: 'rp-btn is-primary', disabled: text.trim() === '' || state.kind === 'loading', onClick: () => read(text) }, t('import.read')),
          h('label', { className: 'rp-btn' }, t('import.file'), h('input', { type: 'file', accept: '.json,application/json', className: 'rp-hidden', onChange: (event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file === undefined) return
            if (file.size > 2 * 1024 * 1024) { setState({ kind: 'bad', reason: t('import.tooLarge') }); return }
            file.text().then((raw) => { setText(raw); read(raw) }, () => setState({ kind: 'bad', reason: t('import.unreadable') }))
          } }))),
        state.kind === 'bad' ? h('div', { className: 'rp-note is-warn', role: 'alert' }, t('jsonInvalid', { reason: state.reason })) : null,
        state.kind === 'error' ? h('div', { className: 'rp-note is-warn', role: 'alert' }, ui.describe(state.error)) : null,
        state.kind === 'empty' ? h('div', { className: 'rp-note is-warn', role: 'alert' }, t('import.empty')) : null,
        state.kind === 'ok' ? h('div', { className: 'rp-section', role: 'status' },
          h('div', null, pl(t, 'import.found', state.checked.config.rules.length)),
          h('ul', { className: 'rp-problems' }, state.checked.config.rules.map(rule => h('li', { key: rule.id }, `${rule.name || t('card.unnamed')} — ${rule.match.hosts.join(', ') || t('problem.no-host')}`))),
          state.checked.problems.length === 0 ? null : h('div', { className: 'rp-hint is-warn' }, pl(t, 'import.problems', new Set(state.checked.problems.map(problem => problem.ruleId)).size)),
          h('div', { className: 'rp-hint' }, t('import.unsaved')),
          confirm ? h(ConfirmBox, { ui, text: t('import.confirmReplace'), action: t('import.replace'), danger: true, onCancel: () => setConfirm(false), onConfirm: () => onApply(state.checked.config, 'replace') }) : h('div', { className: 'rp-bar' },
            h('button', { type: 'button', className: 'rp-btn is-primary', onClick: () => onApply(state.checked.config, 'append') }, t('import.append')),
            hasRules ? h('button', { type: 'button', className: 'rp-btn', onClick: () => setConfirm(true) }, t('import.replace')) : null)) : null)
    }

    function HelpPanel({ ui, onClose }) {
      const { t } = ui
      const ref = usePanelFocus()
      return h('div', { className: 'rp-panel', ref, tabIndex: -1, role: 'group', 'aria-label': t('help.title'), onKeyDown: onEscape(onClose) },
        h('div', { className: 'rp-bar' }, h('strong', { className: 'rp-grow' }, t('help.title')), h('button', { type: 'button', className: 'rp-btn is-ghost is-icon', 'aria-label': t('close'), title: t('close'), onClick: onClose }, h(Icon, { name: 'x' }))),
        ['help.what', 'help.how', 'help.templates', 'help.safety', 'help.privacy'].map(key => h('p', { key, className: 'rp-helpp' }, t(key))))
    }

    /** The page's sections: each configured channel, the other addresses, the request log, and the dry run. */
    function Nav({ ui, sel, onSelect, channelsState, rules, otherCount, recent }) {
      const { t } = ui
      const item = ({ key, icon, name, sub, end: parts }) => {
        const end = (Array.isArray(parts) ? parts : [parts]).filter(part => part !== null)
        return h('button', { key, type: 'button', className: 'rp-navitem', 'aria-current': sel === key ? 'page' : undefined, onClick: () => onSelect(key) },
          h('span', { className: 'rp-navicon' }, h(Icon, { name: icon })),
          h('span', { className: 'rp-navtext' }, h('span', { className: 'rp-navname' }, name), sub === undefined ? null : h('span', { className: 'rp-navsub' }, sub)),
          end.length === 0 ? null : h('span', { className: 'rp-navend' }, end))
      }
      const count = (n, on, title) => (n === 0 ? null : h('span', { key: 'count', className: `rp-count${on ? ' is-on' : ''}`, title }, n))
      const channels = channelsState?.channels ?? []
      let channelHint = null
      if (channelsState === null) channelHint = t('channels.loading')
      else if (channelsState.error !== undefined) channelHint = t('channels.failed', { reason: channelsState.error })
      else if (!channelsState.available) channelHint = t('channels.unavailable')
      else if (channels.length === 0) channelHint = t('channels.none')
      return h('nav', { className: 'rp-nav', 'aria-label': t('nav.label') },
        h('div', { className: 'rp-navlabel' }, t('nav.channels')),
        channelHint === null ? null : h('div', { className: 'rp-navhint' }, channelHint),
        channels.map((channel) => {
          const active = rules.filter(rule => rule.enabled && reaches(rule, channel)).length
          const last = recent.find(entry => channelOfRequest(channels, entry)?.id === channel.id)
          const failed = last !== undefined && (last.networkError !== undefined || (last.status !== undefined && last.status >= 400))
          const dot = last === undefined || (last.status === undefined && last.networkError === undefined) ? null : h('span', { key: 'dot', className: `rp-dot ${failed ? 'is-bad' : 'is-ok'}`, title: t(failed ? 'nav.lastFailed' : 'nav.lastOk') })
          return item({ key: `c:${channel.id}`, icon: 'server', name: channel.name, sub: channel.host === undefined ? t('channels.source.unknown') : `${channel.host}${channel.basePath}`, end: [dot, count(active, true, pl(t, 'nav.params', active))] })
        }),
        item({ key: 'other', icon: 'globe', name: t('nav.other'), end: count(otherCount, true, pl(t, 'nav.params', otherCount)) }),
        h('div', { className: 'rp-navlabel' }, t('nav.tools')),
        item({ key: 'requests', icon: 'pulse', name: t('nav.requests'), end: count(recent.length, false) }),
        item({ key: 'try', icon: 'play', name: t('nav.try'), end: null }))
    }

    /** Which page to open first: a channel that already has parameters, else OpenRouter, else any channel with an address. */
    function firstSection(channels, rules) {
      const usable = channels.filter(channel => channel.host !== undefined)
      const pick = usable.find(channel => rules.some(rule => reaches(rule, channel))) ?? usable.find(channel => channel.openrouter) ?? usable[0]
      return pick === undefined ? 'other' : `c:${pick.id}`
    }

    function Page({ ctx, t }) {
      React.useSyncExternalStore(listener => ctx.locale.subscribe(listener), () => ctx.locale.getSnapshot())
      const zh = String(ctx.locale.getSnapshot().active).toLowerCase().startsWith('zh')
      const lang = zh ? 'zh' : 'en'
      const [view] = React.useState(() => readStored('sessionStorage', VIEW_KEY, {}))
      const [server, setServer] = React.useState(null)
      const [draft, setDraft] = React.useState(null)
      const [failure, setFailure] = React.useState(null)
      const [loading, setLoading] = React.useState(false)
      const [sel, setSel] = React.useState(() => (typeof view.sel === 'string' ? view.sel : null))
      const [openIds, setOpenIds] = React.useState(() => (Array.isArray(view.open) ? view.open.filter(id => typeof id === 'string') : []))
      const [panel, setPanelState] = React.useState(null)
      const [notice, setNotice] = React.useState(null)
      const [saving, setSaving] = React.useState(false)
      const [conflict, setConflict] = React.useState(false)
      const [checked, setChecked] = React.useState({ problems: [], env: {} })
      const [building, setBuilding] = React.useState(() => new Set())
      const [recent, setRecent] = React.useState({ recent: [], endpoints: [] })
      const [confirm, setConfirm] = React.useState(null)
      const [channels, setChannels] = React.useState(null)
      const alive = React.useRef(true)
      const loadSeq = React.useRef(0)
      const checkSeq = React.useRef(0)
      const draftRef = React.useRef(null)
      const panelNow = React.useRef(null)
      const openerRef = React.useRef(null)
      const noticeTimer = React.useRef(undefined)
      const buildTimers = React.useRef(new Map())
      const undoRef = React.useRef(null)
      const serverRef = React.useRef(null)
      const dirtyRef = React.useRef(false)
      const selRef = React.useRef(null)
      draftRef.current = draft
      serverRef.current = server
      panelNow.current = panel

      const describeCode = (code, details, fallback) => {
        const key = `err.${code}`
        const text = t(key, details)
        return text === key ? fallback : text
      }
      const describe = error => (error instanceof ActionFailure ? describeCode(error.code, error.details, error.message) : error.message)
      const show = (next) => {
        clearTimeout(noticeTimer.current)
        setNotice(next)
        if (next?.kind === 'done') noticeTimer.current = setTimeout(() => { if (alive.current) setNotice(null) }, next.action === undefined ? NOTICE_MS : NOTICE_MS * 3)
      }
      /** Open, switch, or close the panel below the header, remembering what had focus so closing can give it back. */
      const setPanel = (next) => {
        if (next !== null && panelNow.current === null) openerRef.current = document.activeElement
        panelNow.current = next
        setPanelState(next)
      }
      React.useEffect(() => {
        if (panel !== null || openerRef.current === null) return
        const opener = openerRef.current
        openerRef.current = null
        if (opener.isConnected) opener.focus({ preventScroll: true })
      }, [panel])
      React.useEffect(() => {
        const onKey = (event) => {
          if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing || panelNow.current === null) return
          const target = event.target
          if (target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) && !target.closest('.rp-panel')) return
          event.preventDefault()
          setPanel(null)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
      }, [])
      React.useEffect(() => { writeStored('sessionStorage', VIEW_KEY, { sel, open: openIds }) }, [sel, openIds])
      const loadChannels = React.useCallback(() => post('channels', {}).then(
        (value) => { if (alive.current) setChannels(value) },
        (error) => { if (alive.current) setChannels({ available: true, channels: [], error: error.message }) },
      ), [])

      const adopt = (value) => {
        setServer(value)
        setRecent({ recent: value.recent, endpoints: value.endpoints })
      }
      const load = React.useCallback(async (keepDraft) => {
        const seq = ++loadSeq.current
        setLoading(true)
        try {
          const value = await post('get', {})
          if (!alive.current || seq !== loadSeq.current) return
          if (keepDraft && dirtyRef.current && serverRef.current !== null) {
            // Unsaved edits stay; a file that changed since they were started is flagged, not adopted.
            setRecent({ recent: value.recent, endpoints: value.endpoints })
            if (value.revision !== serverRef.current.revision) setConflict(true)
            else setServer(value)
            return
          }
          adopt(value)
          const stored = readStored('sessionStorage', DRAFT_KEY, null)
          const restore = !keepDraft && stored !== null && stored.revision === value.revision && stored.config !== null && typeof stored.config === 'object' && Array.isArray(stored.config.rules)
          const fresh = { enabled: value.enabled, rules: clone(value.rules) }
          setDraft(restore ? stored.config : fresh)
          if (restore) show({ kind: 'done', text: t('draftRestored') })
          setFailure(null)
        } catch (error) {
          if (alive.current && seq === loadSeq.current) setFailure(describe(error))
        } finally {
          if (alive.current && seq === loadSeq.current) setLoading(false)
        }
      }, [])
      React.useEffect(() => {
        alive.current = true
        void load(false)
        void loadChannels()
        return () => {
          alive.current = false
          clearTimeout(noticeTimer.current)
          for (const timer of buildTimers.current.values()) clearTimeout(timer)
        }
      }, [])

      const dirty = server !== null && draft !== null && !same(draft, { enabled: server.enabled, rules: server.rules })
      dirtyRef.current = dirty
      React.useEffect(() => {
        if (server === null) return
        writeStored('sessionStorage', DRAFT_KEY, dirty ? { revision: server.revision, config: draft } : undefined)
      }, [dirty, draft, server?.revision])
      React.useEffect(() => {
        if (!dirty) return undefined
        const warn = (event) => { event.preventDefault(); event.returnValue = '' }
        window.addEventListener('beforeunload', warn)
        return () => window.removeEventListener('beforeunload', warn)
      }, [dirty])

      // Rules are checked on the Host, so the page and the engine never disagree about what is valid.
      const settled = useDebounced(draft, 300)
      React.useEffect(() => {
        if (settled === null) return
        const seq = ++checkSeq.current
        post('check', { config: settled }).then((value) => { if (alive.current && seq === checkSeq.current) setChecked({ problems: value.problems, env: value.env }) }, () => {
          // The next edit checks again; a failed check leaves the earlier result in place.
        })
      }, [settled])
      React.useEffect(() => {
        const timer = setInterval(() => {
          if (document.visibilityState !== 'visible') return
          post('recent', {}).then((value) => {
            if (!alive.current) return
            setRecent({ recent: value.recent, endpoints: value.endpoints })
            const current = serverRef.current
            // A higher revision than the page's own means the file was changed elsewhere (a stale answer has a lower one).
            if (current === null || value.revision <= current.revision) return
            if (dirtyRef.current) setConflict(true)
            else { void load(false); show({ kind: 'done', text: t('changedElsewhere') }) }
          }, () => {
            // The next poll tries again.
          })
        }, 3000)
        return () => clearInterval(timer)
      }, [])

      const channelList = channels?.channels ?? []
      const problemsBy = React.useMemo(() => {
        const map = new Map()
        for (const problem of checked.problems) map.set(problem.ruleId, [...map.get(problem.ruleId) ?? [], problem])
        return map
      }, [checked])
      const providers = useProviders(draft?.rules.some(rule => rule.preset?.id === 'openrouter-routing') ?? false)
      const names = React.useMemo(() => Object.fromEntries((providers?.providers ?? []).map(item => [item.slug, item.name])), [providers])

      // A remembered channel that is gone falls back to the first useful section once the channels are known.
      let current = sel
      if (channels !== null && draft !== null && (current === null || (current.startsWith('c:') && !channelList.some(channel => `c:${channel.id}` === current)))) current = firstSection(channelList, draft.rules)
      selRef.current = current
      const select = (next) => {
        setSel(next)
        setPanel(null)
      }

      const updateRule = (id, change) => setDraft(state => ({ ...state, rules: state.rules.map(rule => (rule.id === id ? change(clone(rule)) : rule)) }))
      const doneBuilding = id => setBuilding((state) => {
        const next = new Set(state)
        next.delete(id)
        return next
      })
      const setForm = (id, patch) => {
        updateRule(id, (rule) => {
          if (rule.preset !== undefined) rule.preset.form = { ...rule.preset.form, ...patch }
          return rule
        })
        setBuilding(state => new Set(state).add(id))
        clearTimeout(buildTimers.current.get(id))
        buildTimers.current.set(id, setTimeout(async () => {
          const rule = draftRef.current?.rules.find(item => item.id === id)
          if (rule?.preset === undefined) { doneBuilding(id); return }
          const { id: presetId, form } = rule.preset
          try {
            const built = await post('preset', { id: presetId, form })
            const latest = draftRef.current?.rules.find(item => item.id === id)
            // A newer edit has its own build coming; this answer is out of date.
            if (!alive.current || latest?.preset === undefined || !same(latest.preset.form, form)) return
            updateRule(id, (state) => {
              state.body.merge = built.body.merge ?? {}
              state.body.remove = built.body.remove ?? []
              state.headers.set = built.headers.set ?? {}
              return state
            })
            doneBuilding(id)
          } catch (error) {
            doneBuilding(id)
            if (alive.current) show({ kind: 'warn', text: describe(error) })
          }
        }, 200))
      }

      /** Show a rule: open the section it belongs to (staying on the current channel if it reaches it), open its card, and scroll to it; `focus` also closes the other cards and puts the cursor in its first field. */
      const reveal = (rule, focus) => {
        const reached = channelList.filter(channel => reaches(rule, channel))
        const here = reached.find(channel => `c:${channel.id}` === selRef.current)
        setSel(here !== undefined ? `c:${here.id}` : reached.length > 0 ? `c:${reached[0].id}` : 'other')
        setOpenIds(ids => (focus ? [rule.id] : ids.includes(rule.id) ? ids : [...ids, rule.id]))
        setPanel(null)
        setTimeout(() => {
          const node = document.getElementById(`rp-card-${rule.id}`)
          node?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
          if (focus) node?.querySelector('.rp-cardbody input:not([type=checkbox]), .rp-cardbody textarea')?.focus({ preventScroll: true })
        }, 80)
      }
      const addRule = (rule) => {
        if (draftRef.current.rules.length >= server.limits.rules) { show({ kind: 'warn', text: t('limit.rules', { n: server.limits.rules }) }); return }
        setDraft(state => ({ ...state, rules: [...state.rules, rule] }))
        reveal(rule, true)
      }
      /** Start a rule from a preset, a recipe, or a blank one; with a channel, the rule is for that channel. */
      const addFromPreset = async (id, channel) => {
        const named = name => (channel === undefined ? name : `${name} · ${channel.name}`)
        if (id === 'custom') { addRule(blankRule({ name: named(t('preset.custom.name')), ...channel === undefined ? {} : { match: matchOfChannel(channel) } })); return }
        if (id.startsWith('recipe:')) {
          const recipeId = id.slice('recipe:'.length)
          const recipe = RECIPES[recipeId]
          addRule(blankRule({ name: named(t(`recipe.${recipeId}.name`)), match: channel === undefined ? { hosts: [...recipe.hosts], paths: [], models: [] } : matchOfChannel(channel), body: { merge: clone(recipe.merge), defaults: {}, remove: [] }, headers: { set: { ...recipe.headers }, remove: [] } }))
          return
        }
        const entry = server.presets[id]
        try {
          const built = await post('preset', { id, form: entry.form })
          addRule(blankRule({
            name: named(t(`preset.${id}.name`)),
            match: channel === undefined ? { hosts: entry.hosts, paths: [], models: [] } : matchOfChannel(channel),
            body: { merge: built.body.merge ?? {}, defaults: {}, remove: built.body.remove ?? [] },
            headers: { set: built.headers.set ?? {}, remove: [] },
            preset: { id, form: built.form },
          }))
        } catch (error) {
          show({ kind: 'warn', text: describe(error) })
        }
      }
      const ruleForEndpoint = (endpoint) => {
        addRule(blankRule({ name: endpoint.host, match: { hosts: [endpoint.host], paths: [], models: endpoint.models.length === 1 ? endpoint.models : [] } }))
      }
      const duplicateRule = (id) => {
        const source = draftRef.current.rules.find(rule => rule.id === id)
        if (source === undefined) return
        const copy = { ...clone(source), id: newId(), name: t('card.copyName', { name: source.name || t('card.unnamed') }) }
        setDraft((state) => {
          const at = state.rules.findIndex(rule => rule.id === id)
          return { ...state, rules: [...state.rules.slice(0, at + 1), copy, ...state.rules.slice(at + 1)] }
        })
        reveal(copy, false)
      }
      /** Exchange the places of two rules in the order they apply. */
      const swapRules = (a, b) => setDraft((state) => {
        const i = state.rules.findIndex(rule => rule.id === a)
        const j = state.rules.findIndex(rule => rule.id === b)
        if (i < 0 || j < 0) return state
        const rules = [...state.rules]
        ;[rules[i], rules[j]] = [rules[j], rules[i]]
        return { ...state, rules }
      })
      const deleteRule = (id) => {
        const at = draftRef.current.rules.findIndex(rule => rule.id === id)
        const rule = draftRef.current.rules[at]
        if (rule === undefined) return
        setDraft(state => ({ ...state, rules: state.rules.filter(item => item.id !== id) }))
        undoRef.current = { rule, at }
        show({
          kind: 'done',
          text: t('card.deleted', { name: rule.name || t('card.unnamed') }),
          action: { label: t('undo'), run: () => {
            const kept = undoRef.current
            if (kept === null) return
            undoRef.current = null
            setDraft(state => ({ ...state, rules: [...state.rules.slice(0, kept.at), kept.rule, ...state.rules.slice(kept.at)] }))
            reveal(kept.rule, false)
          } },
        })
      }

      const blockers = draft === null ? [] : draft.rules.filter(rule => rule.enabled && (problemsBy.get(rule.id) ?? []).length > 0)
      const canSave = dirty && !saving && building.size === 0 && blockers.length === 0
      const save = async (overwrite) => {
        if (!canSave && overwrite !== true) return
        setSaving(true)
        try {
          const value = await post('save', { config: draftRef.current, revision: overwrite === true ? null : server.revision })
          adopt(value)
          setDraft({ enabled: value.enabled, rules: clone(value.rules) })
          setConflict(false)
          show({ kind: 'done', text: t('saved') })
        } catch (error) {
          if (error.code === 'conflict') setConflict(true)
          else show({ kind: 'warn', text: describe(error) })
        } finally {
          setSaving(false)
        }
      }
      const saveRef = React.useRef(save)
      saveRef.current = save
      React.useEffect(() => {
        const onKey = (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's' && !event.shiftKey && !event.altKey) {
            event.preventDefault()
            void saveRef.current(false)
          }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
      }, [])
      const stopBuilds = () => {
        for (const timer of buildTimers.current.values()) clearTimeout(timer)
        buildTimers.current.clear()
        setBuilding(new Set())
      }
      const discard = () => {
        stopBuilds()
        setDraft({ enabled: server.enabled, rules: clone(server.rules) })
        setConfirm(null)
      }
      /** Drop the unsaved edits and take what is on disk. */
      const loadLatest = () => {
        stopBuilds()
        writeStored('sessionStorage', DRAFT_KEY, undefined)
        dirtyRef.current = false
        setConflict(false)
        void load(false)
      }
      const toggleMaster = async (enabled) => {
        try {
          const value = await post('save', { config: { enabled, rules: server.rules }, revision: server.revision })
          adopt(value)
          setDraft(state => ({ ...state, enabled }))
          show({ kind: 'done', text: t(enabled ? 'master.resumed' : 'master.pausedDone') })
        } catch (error) {
          if (error.code === 'conflict') setConflict(true)
          else show({ kind: 'warn', text: describe(error) })
        }
      }
      const resetDamaged = async () => {
        try {
          const value = await post('resetDamaged', {})
          adopt(value)
          setDraft({ enabled: value.enabled, rules: clone(value.rules) })
          setConfirm(null)
          show({ kind: 'done', text: t('damaged.done', { path: value.movedTo }) })
        } catch (error) {
          show({ kind: 'warn', text: describe(error) })
        }
      }
      const clearRecent = () => post('clearRecent', {}).then(value => setRecent(value), error => show({ kind: 'warn', text: describe(error) }))
      /** Dry-run a sample request; `useDraft` applies the unsaved rules, and `enabled` overrides the pause switch for a preview. */
      const dryRun = ({ url, body, session, useDraft, enabled }) => {
        const base = useDraft ? draftRef.current : undefined
        const config = base === undefined ? undefined : enabled === undefined ? base : { ...base, enabled }
        return post('dryRun', { url, body, session, ...config === undefined ? {} : { config } })
      }

      const exportRules = () => {
        const text = `${pretty({ version: 1, enabled: draft.enabled, rules: draft.rules })}\n`
        const link = document.createElement('a')
        link.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
        link.download = 'dsh-request-params-rules.json'
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => URL.revokeObjectURL(link.href), 1000)
      }
      const applyImport = (config, mode) => {
        setDraft((state) => {
          const taken = new Set(mode === 'replace' ? [] : state.rules.map(rule => rule.id))
          const incoming = config.rules.map((rule) => {
            const id = taken.has(rule.id) ? newId() : rule.id
            taken.add(id)
            return { ...rule, id }
          })
          return { ...state, rules: mode === 'replace' ? incoming : [...state.rules, ...incoming].slice(0, server.limits.rules) }
        })
        setPanel(null)
        show({ kind: 'done', text: t('import.applied') })
      }
      const refresh = () => {
        void load(true)
        void loadChannels()
      }

      const ui = {
        t, lang, describe, draft,
        limits: server?.limits,
        endpoints: recent.endpoints,
        channels: channelList,
        updateRule, setForm, deleteRule, duplicateRule, swapRules, ruleForEndpoint, dryRun, addFromPreset, select,
        toggleOpen: id => setOpenIds(ids => (ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id])),
      }

      let body
      let statusText = null
      if (server === null || draft === null) {
        body = failure === null ? h('div', { className: 'rp-skeleton', 'aria-busy': true }, h('span'), h('span'), h('span')) : h('div', { className: 'rp-note is-warn', role: 'alert' }, h('span', { className: 'rp-grow' }, t('loadFailed', { reason: failure })), h('button', { type: 'button', className: 'rp-btn', onClick: () => load(false) }, t('retry')))
      } else {
        const rules = draft.rules
        const savedActive = server.rules.filter(rule => rule.enabled && (server.problems ?? []).every(problem => problem.ruleId !== rule.id)).length
        const last = recent.recent[0]
        if (!server.enabled) statusText = t('status.paused')
        else if (savedActive === 0) statusText = last === undefined ? t('intro') : t('status.noRules')
        else statusText = pl(t, 'status.active', savedActive)
        if (last !== undefined) statusText += ` · ${t('status.last', { ago: ago(lang, last.at), result: last.changed ? pl(t, 'status.lastApplied', last.changes.length + (last.moreChanges ?? 0)) : last.paused ? t('status.lastPaused') : t('status.lastPlain') })}`
        const others = rules.filter(rule => !channelList.some(channel => reaches(rule, channel)))
        const channel = current?.startsWith('c:') ? channelList.find(item => `c:${item.id}` === current) : undefined
        const shared = { ui, problemsBy, openIds, env: checked.env, providers, names }
        let detail
        if (current === null) detail = h('div', { className: 'rp-skeleton', 'aria-busy': true }, h('span'), h('span'))
        else if (channel !== undefined) detail = h(ChannelDetail, { key: channel.id, ...shared, channel, recent: recent.recent, enabled: server.enabled, dirty, onPause: () => toggleMaster(false) })
        else if (current === 'requests') detail = h(RequestsView, { ui, recent: recent.recent, endpoints: recent.endpoints, rules, enabled: server.enabled, onClear: clearRecent, onPause: () => toggleMaster(false) })
        else if (current === 'try') detail = h(TryView, { ui, dirty, rules, defaultUrl: recent.endpoints[0] === undefined ? undefined : `${recent.endpoints[0].scheme ?? 'https'}://${recent.endpoints[0].host}${recent.endpoints[0].path}`, defaultModel: recent.endpoints[0]?.models[0] })
        else detail = h(OtherDetail, { ...shared, rules: others })
        body = h(React.Fragment, null,
          server.damaged === undefined ? null : h('div', { className: 'rp-note is-warn', role: 'alert' },
            h('div', { className: 'rp-grow' }, h('div', null, t('damaged.title')), h('div', null, t('damaged.detail', { path: server.damaged.path, reason: server.damaged.message }))),
            confirm === 'reset' ? null : h('button', { type: 'button', className: 'rp-btn', onClick: () => setConfirm('reset') }, t('damaged.reset'))),
          confirm === 'reset' ? h(ConfirmBox, { ui, text: t('damaged.confirm'), action: t('damaged.reset'), onCancel: () => setConfirm(null), onConfirm: resetDamaged }) : null,
          conflict ? h('div', { className: 'rp-note is-warn', role: 'alert' },
            h('span', { className: 'rp-grow' }, t('conflict.text')),
            h('button', { type: 'button', className: 'rp-btn', onClick: loadLatest }, t('conflict.reload')),
            h('button', { type: 'button', className: 'rp-btn', onClick: () => save(true) }, t('conflict.overwrite'))) : null,
          panel === 'help' ? h(HelpPanel, { ui, onClose: () => setPanel(null) }) : null,
          panel === 'import' ? h(ImportPanel, { ui, hasRules: rules.length > 0, onApply: applyImport, onClose: () => setPanel(null) }) : null,
          h('div', { className: 'rp-split' },
            h(Nav, { ui, sel: current, onSelect: select, channelsState: channels, rules, otherCount: others.length, recent: recent.recent }),
            detail))
      }

      return h('div', { className: 'rp' },
        h('style', null, CSS),
        h('div', { className: 'rp-inner' },
          h('header', { className: 'rp-top' },
            h('div', { className: 'rp-heading' },
              h('h1', { className: 'rp-title' }, t('title'), server?.version === undefined ? null : h('span', { className: 'rp-version' }, `v${server.version}`)),
              statusText === null ? null : h('p', { className: 'rp-status', role: 'status' },
                h('span', { className: `rp-dot${server.enabled ? (statusText === t('intro') ? '' : ' is-ok') : ' is-warn'}`, 'aria-hidden': true }),
                h('span', null, statusText))),
            server === null ? null : h('div', { className: 'rp-topactions' },
              h('label', { className: `rp-master${server.enabled ? '' : ' is-off'}` },
                h(Switch, { checked: server.enabled, label: t(server.enabled ? 'master.pause' : 'master.resume'), onChange: toggleMaster }),
                h('span', null, t(server.enabled ? 'master.on' : 'master.off'))),
              h(Popover, { label: t('more'), className: 'rp-btn is-ghost is-icon', trigger: h(Icon, { name: 'more' }) }, close => [
                h(MenuItem, { key: 'import', close, onClick: () => setPanel('import') }, t('import.button')),
                h(MenuItem, { key: 'export', close, disabled: draft === null || draft.rules.length === 0, onClick: exportRules }, t('export.button')),
                h(MenuItem, { key: 'help', close, onClick: () => setPanel('help') }, t('help.button')),
                h('div', { key: 'sep', className: 'rp-menusep', role: 'separator' }),
                h(MenuItem, { key: 'refresh', close, disabled: loading, onClick: refresh }, t('refresh')),
              ]))),
          body),
        h('div', { className: 'rp-dock' },
          notice === null ? null : h('div', { className: `rp-toast${notice.kind === 'warn' ? ' is-warn' : ''}`, role: notice.kind === 'warn' ? 'alert' : 'status' },
            h('span', { className: 'rp-grow' }, notice.text),
            notice.action === undefined ? null : h('button', { type: 'button', className: 'rp-onbar is-primary', onClick: () => { const { run } = notice.action; show(null); run() } }, notice.action.label),
            h('button', { type: 'button', className: 'rp-onbar is-icon', 'aria-label': t('dismiss'), title: t('dismiss'), onClick: () => show(null) }, h(Icon, { name: 'x', size: 14 }))),
          dirty ? h('div', { className: 'rp-savebar', role: 'region', 'aria-label': t('save.bar') },
            confirm === 'discard' ? h(React.Fragment, null,
              h('span', { className: 'rp-savetext' }, h('strong', null, t('save.confirmDiscard'))),
              h('button', { type: 'button', className: 'rp-onbar', autoFocus: true, onClick: () => setConfirm(null), onKeyDown: onEscape(() => setConfirm(null)) }, t('cancel')),
              h('button', { type: 'button', className: 'rp-onbar is-primary', onClick: discard }, t('save.discard'))) : h(React.Fragment, null,
              h('span', { className: 'rp-savetext' },
                h('strong', null, t('save.unsaved')),
                blockers.length > 0 ? h('span', { className: 'is-bad' }, pl(t, 'save.blocked', blockers.length)) : h('span', null, building.size > 0 ? t('save.building') : t('save.hint'))),
              h('button', { type: 'button', className: 'rp-onbar', disabled: saving, onClick: () => setConfirm('discard') }, t('save.discard')),
              h('button', { type: 'button', className: 'rp-onbar is-primary', disabled: !canSave, onClick: () => save(false) }, saving ? t('save.saving') : t('save.save')))) : null))
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'dsh-request-params: dictionaries')
        const t = ctx.locale.bind(NS)
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 6, label: () => t('nav') }, SidebarIcon))
        ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL_ID }, () => h(Page, { ctx, t })))
      },
    }
  },
})
