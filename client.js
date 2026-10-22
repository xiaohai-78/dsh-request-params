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
    /** Where the page keeps its tab and open rule, an unsaved draft, and the trial request while the person visits another page. */
    const VIEW_KEY = 'dsh-request-params.view'
    const DRAFT_KEY = 'dsh-request-params.draft'
    const TRY_KEY = 'dsh-request-params.try'

    const ZH = {
      'nav': '请求参数',
      'title': '请求参数',
      'intro': '给每个模型请求加上你指定的参数：OpenRouter 的渠道路由、额外字段、请求头，都在这里配置',
      'refresh': '刷新',
      'retry': '重试',
      'dismiss': '关闭',
      'close': '关闭',
      'cancel': '取消',
      'add': '添加',
      'undo': '撤销',
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
      'master.pause': '暂停所有规则',
      'master.resume': '恢复所有规则',
      'master.pausedDone': '已暂停：所有规则立刻不再修改请求',
      'master.resumed': '已恢复：规则从下一个请求起生效',
      'status.paused': '已暂停 · 规则不会修改任何请求',
      'status.noRules': '还没有生效的规则',
      'status.active': '{n} 条规则生效中',
      'status.active.one': '1 条规则生效中',
      'status.last': '最近一次模型请求 {ago}：{result}',
      'status.lastApplied': '加上了 {n} 项修改',
      'status.lastApplied.one': '加上了 1 项修改',
      'status.lastPaused': '因暂停没有修改',
      'status.lastPlain': '没有规则命中',
      'tabs.label': '视图',
      'tabs.rules': '规则',
      'tabs.requests': '最近请求',
      'tabs.try': '试运行',
      'import.button': '导入',
      'export.button': '导出',
      'help.button': '说明',
      'rules.order': '规则从上到下依次应用，靠后的规则能看到前面的结果。改动保存后才生效。',
      'rule.new': '新建规则',
      'rule.unnamed': '未命名规则',
      'rule.noHost': '未填主机',
      'rule.empty': '还没有内容',
      'rule.fields': '{n} 个字段',
      'rule.fields.one': '1 个字段',
      'rule.removes': '删 {n} 个字段',
      'rule.headers': '{n} 个请求头',
      'rule.headers.one': '1 个请求头',
      'rule.enable': '启用「{name}」',
      'rule.disable': '停用「{name}」',
      'rule.problems': '{n} 个问题',
      'rule.problems.one': '1 个问题',
      'rule.hits': '改过 {n} 次',
      'rule.hitsTitle': '在最近的请求里，这条规则改过 {n} 次',
      'rule.name': '名称',
      'rule.namePlaceholder': '例如：只走 DeepInfra',
      'rule.note': '备注（可选）',
      'rule.notePlaceholder': '写给以后的自己：为什么要这条规则',
      'rule.duplicate': '复制',
      'rule.moveUp': '上移',
      'rule.moveDown': '下移',
      'rule.delete': '删除',
      'rule.confirmDelete': '删除规则「{name}」？删除后可以马上撤销，也可以放弃整个草稿',
      'rule.deleted': '已删除「{name}」',
      'rule.copyName': '{name}（副本）',
      'limit.rules': '最多 {n} 条规则',
      'empty.title': '还没有规则',
      'empty.body': '挑一个开始。规则只会给发往模型的请求加字段和请求头，不会读取或保存你的对话内容。',
      'gallery.title': '新建规则',
      'channels.title': '已配置的渠道',
      'channels.titleCount': '已配置的渠道 · {n}',
      'channels.hint': 'dsh 里已经配好的模型渠道，点一下就能为它建规则，不用再填主机',
      'channels.loading': '正在读取已配置的渠道…',
      'channels.failed': '读取已配置的渠道失败：{reason}',
      'channels.unavailable': '这个 dsh 没有提供渠道列表，可以在「最近请求」里从见过的接口建规则',
      'channels.none': '还没有配置模型渠道',
      'channels.noHost': '不知道这个渠道发往哪个地址，先用它发一条消息',
      'channels.models': '{n} 个模型',
      'channels.models.one': '1 个模型',
      'channels.rules': '已有 {n} 条规则',
      'channels.rules.one': '已有 1 条规则',
      'channels.make': '建规则',
      'channels.more': '其他参数',
      'channels.routing': '设置渠道路由',
      'channels.seen': '已见过请求',
      'channels.source.settings': '来自渠道设置',
      'channels.source.default': '默认地址',
      'channels.source.environment': '来自环境变量',
      'channels.source.seen': '从请求得知',
      'channels.source.unknown': '地址未知',
      'channels.modelsError': '模型列表没读到：{reason}',
      'gallery.forChannel': '为「{name}」建规则：只作用于 {where}',
      'match.fromChannel': '从已配置的渠道添加…',
      'gallery.popular': '常用',
      'gallery.recipes': '其他网关的示例（创建后可以随便改）',
      'recipe.vllm-thinking.name': 'vLLM / Qwen3：关闭思考',
      'recipe.vllm-thinking.desc': '给自建的 vLLM 服务传 chat_template_kwargs，让 Qwen3 这类模型不思考；创建后填上你的服务器主机',
      'recipe.vllm-thinking.example': 'chat_template_kwargs: { enable_thinking: false }',
      'recipe.helicone.name': 'Helicone 观测',
      'recipe.helicone.desc': '带上 Helicone 的认证、会话和自定义属性请求头；密钥从环境变量 HELICONE_API_KEY 读取',
      'recipe.helicone.example': 'Helicone-Session-Id: {{session}}',
      'recipe.cloudflare.name': 'Cloudflare AI Gateway 缓存',
      'recipe.cloudflare.desc': '设置网关缓存时长，并用会话 ID 给请求打标签',
      'recipe.cloudflare.example': 'cf-aig-cache-ttl: 3600',
      'recipe.openai-cache.name': 'OpenAI 提示缓存键',
      'recipe.openai-cache.desc': '用会话 ID 作 prompt_cache_key，同一场对话更容易命中缓存',
      'recipe.openai-cache.example': 'prompt_cache_key: "{{session}}"',
      'preset.openrouter-routing.name': 'OpenRouter 渠道路由',
      'preset.openrouter-routing.desc': '指定走哪些供应商、顺序、价格上限、零数据留存，以及备用模型',
      'preset.openrouter-routing.example': 'provider: { order: ["deepinfra"], … }',
      'preset.reasoning.name': '思考强度',
      'preset.reasoning.desc': '设置 reasoning 的强度或预算，或不返回思考内容',
      'preset.reasoning.example': 'reasoning: { effort: "high" }',
      'preset.sampling.name': '采样参数',
      'preset.sampling.desc': 'top_k、min_p、top_a、repetition_penalty 这类非标准采样项',
      'preset.sampling.example': 'top_k: 40, min_p: 0.05',
      'preset.session.name': '会话粘性',
      'preset.session.desc': '带上会话 ID，让同一场对话走同一个供应商，更容易命中缓存',
      'preset.session.example': 'session_id: "{{session}}"',
      'preset.attribution.name': '应用署名',
      'preset.attribution.desc': 'OpenRouter 用 HTTP-Referer 和标题，把流量记到你的应用名下',
      'preset.attribution.example': 'X-OpenRouter-Title: My App',
      'preset.strip.name': '删除字段',
      'preset.strip.desc': '网关不认某些字段（比如 store）而报错时，发出前先去掉',
      'preset.strip.example': 'remove: ["store"]',
      'preset.custom.name': '自定义规则',
      'preset.custom.desc': '自己写要加的 JSON 字段和请求头，适用于任何网关',
      'preset.custom.example': '{ "your_field": "value" }',
      'params.custom': '要加的内容',
      'match.title': '适用于',
      'match.hosts': '主机',
      'match.hostsHint': '请求发往这些主机才生效，例如 openrouter.ai 或 *.example.com（*.x 也包含 x 本身）。不写端口就匹配任何端口',
      'match.models': '模型（可选）',
      'match.modelsHint': '留空 = 所有模型。可以用通配符：deepseek/*、*-chat',
      'match.paths': '路径（可选）',
      'match.pathsHint': '留空 = 只作用于模型接口（…/chat/completions、…/messages、…/responses）。写了路径就按前缀匹配，也能用在别的接口上',
      'route.order': '优先顺序',
      'route.orderHint': '按顺序尝试。写供应商的 slug（如 deepinfra），也可以带变体（deepinfra/fp4）',
      'route.providerPlaceholder': '输入供应商，例如 deepinfra',
      'route.only': '只允许这些',
      'route.onlyHint': '其他供应商一律不用',
      'route.ignore': '排除这些',
      'route.ignoreHint': '这些供应商这次不用',
      'route.fallbacks': '失败时允许换用其他供应商',
      'route.fallbacksHint': '关掉后，指定的供应商都不可用就直接报错',
      'route.require': '只用支持请求里全部参数的供应商',
      'route.requireHint': '否则不支持的参数会被悄悄忽略',
      'route.zdr': '只用零数据留存（ZDR）的供应商',
      'route.zdrHint': '供应商不会保留你的提示和回答',
      'route.sort': '排序',
      'route.sortHint': '默认按价格做负载均衡',
      'route.sortDefault': '默认',
      'route.sortPrice': '价格',
      'route.sortThroughput': '吞吐量',
      'route.sortLatency': '延迟',
      'route.models': '备用模型',
      'route.modelsHint': '主模型不可用时，按顺序换用这些模型',
      'route.moreOptions': '更多筛选…',
      'route.lessOptions': '收起更多筛选',
      'route.data': '数据收集',
      'route.dataHint': '是否允许使用会存储请求数据的供应商',
      'route.dataDefault': '不指定',
      'route.dataAllow': '允许',
      'route.dataDeny': '拒绝',
      'route.quant': '量化精度',
      'route.quantHint': '只用这些精度的端点；一个都不选 = 不限',
      'route.maxPrompt': '输入价格上限',
      'route.maxCompletion': '输出价格上限',
      'route.perMillion': '美元 / 百万 token',
      'route.minThroughput': '期望最低吞吐',
      'route.maxLatency': '期望最高延迟',
      'route.perfHint': '只是偏好：达标的优先，不会因此拒绝请求',
      'route.seconds': '秒',
      'route.distillable': '只用允许蒸馏文本的模型',
      'route.distillableHint': 'enforce_distillable_text',
      'route.bundled': '没连上 OpenRouter，用的是内置的供应商列表（{date}）',
      'route.noTraffic': '还没有看到发往 openrouter.ai 的请求。规则在你用 OpenRouter 渠道发消息时生效（需要先在 llm-pi-ai 里加上 openrouter，见插件说明）',
      'explore.title': '看看这个模型有哪些供应商',
      'explore.show': '查看',
      'explore.hint': '输入 OpenRouter 的模型 ID，列出供应商、价格和速度，再一键加进上面的列表',
      'explore.loading': '正在查询…',
      'explore.count': '{n} 个端点',
      'explore.count.one': '1 个端点',
      'explore.stale': '没连上 OpenRouter，显示的是缓存',
      'explore.none': 'OpenRouter 没有列出这个模型的端点',
      'explore.priceTitle': '输入 / 输出，美元每百万 token',
      'explore.col.provider': '供应商',
      'explore.col.quant': '量化',
      'explore.col.price': '价格 入/出',
      'explore.col.context': '上下文',
      'explore.col.uptime': '可用率',
      'explore.col.speed': '速度',
      'explore.col.route': '路由',
      'explore.addOrder': '加入顺序',
      'explore.addOnly': '只允许',
      'explore.addIgnore': '排除',
      'reasoning.effort': '思考强度',
      'reasoning.effortHint': 'xhigh 最深，none 关闭；模型不支持时 OpenRouter 会忽略它',
      'reasoning.maxTokens': '思考 token 预算',
      'reasoning.maxTokensHint': '给支持预算的模型用，和强度二选一',
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
      'session.body': '请求体加 session_id',
      'session.bodyHint': '值是 {{session}}，即 dsh 的会话 ID',
      'session.header': '加请求头 x-session-id',
      'session.headerHint': '同一个会话 ID，部分网关用它做缓存亲和',
      'attr.title': '应用名称',
      'attr.titleHint': '写入请求头 X-OpenRouter-Title',
      'attr.referer': '应用网址',
      'attr.refererHint': '写入请求头 HTTP-Referer',
      'strip.fields': '要删除的字段',
      'strip.hint': '嵌套字段用点号，如 stream_options.include_usage。messages、model 等核心字段不能在这里删',
      'custom.merge': '总是设置的字段 (JSON)',
      'custom.mergeHint': '每次都写进请求体；对象会和已有内容合并，其他类型直接替换',
      'custom.defaults': '缺少时才设置 (JSON)',
      'custom.defaultsHint': '请求里已经有这个字段就不动它',
      'custom.remove': '删除的字段',
      'custom.removeHint': '用点号写路径，例如 store、stream_options.include_usage。先删除，再设置',
      'custom.headers': '要加的请求头',
      'custom.headersHint': '同名请求头会被替换；Authorization 等认证头不能改',
      'custom.removeHeaders': '要去掉的请求头',
      'custom.removeHeadersHint': '名称不区分大小写',
      'custom.templates': '值里可以写：{{model}} 当前模型 · {{session}} 会话 ID · {{env:名称}} 读环境变量（密钥放这里，值不会显示在页面和请求记录里）',
      'custom.protected': '允许改核心字段',
      'custom.protectedHint': '默认不能动 {fields}；打开后这条规则可以改写它们，请确认你清楚后果',
      'headers.add': '添加请求头',
      'headers.name': '请求头名称',
      'headers.value': '请求头的值',
      'headers.valuePlaceholder': '值，可以写 {{env:KEY}}',
      'headers.remove': '删除请求头 {name}',
      'env.set': '环境变量 {name} 已设置',
      'env.unset': '环境变量 {name} 没有设置：用到它的字段会被跳过',
      'generated.show': '查看生成的 JSON',
      'generated.hide': '收起',
      'generated.detach': '改成自定义编辑',
      'generated.empty': '还没有内容',
      'generated.confirmDetach': '改成自定义编辑后，这条规则不再有上面的表单，只能直接改 JSON。继续吗？',
      'problem.no-host': '还没有填主机',
      'problem.bad-host': '主机写法不对：{detail}',
      'problem.too-large': '内容太大，超过上限',
      'problem.too-deep': '嵌套层数太多',
      'problem.bad-key': '不允许的字段名：{detail}',
      'problem.protected': '不能改核心字段 {detail}（需要在自定义规则里勾选「允许改核心字段」）',
      'problem.template-env-name': '环境变量名不对：{detail}',
      'problem.template-unknown': '不认识的模板变量：{detail}（可用 model、session、env:名称）',
      'problem.bad-path': '删除路径不对：{detail}',
      'problem.bad-header': '请求头名称不对：{detail}',
      'problem.forbidden-header': '请求头 {detail} 不能改（认证和传输相关）',
      'problem.bad-header-value': '请求头 {detail} 的值不能换行',
      'problem.duplicate-header': '请求头 {detail} 写了两次',
      'invalid.rule': '规则「{rule}」命中了这个请求，但它有问题，没有应用：{problems}',
      'skipped.env-missing': '规则「{rule}」的 {field} 用到环境变量 {name}，它没有设置，这一项被跳过',
      'skipped.bad-value': '规则「{rule}」的请求头 {name} 的值里有换行，已跳过',
      'change.set': '设置',
      'change.default': '默认值',
      'change.remove': '删除',
      'change.header': '请求头',
      'change.header-remove': '去掉请求头',
      'change.secret': '（来自环境变量，不显示）',
      'change.more': '还有 {n} 项',
      'req.intro': '这里是 dsh 最近发出的模型请求，只放在内存里，重启后清空。记录里有模型、地址和改动；请求出错时还有网关返回的前 2 KB 文字（可能引用请求内容）',
      'req.clear': '清空',
      'req.endpoints': '见过的模型接口',
      'req.count': '{n} 次',
      'req.count.one': '1 次',
      'req.makeRule': '为它建规则',
      'req.emptyTitle': '还没有模型请求',
      'req.emptyHint': '发一条消息，请求就会出现在这里，并显示规则有没有生效、网关返回了什么',
      'req.noModel': '(没有模型名)',
      'req.applied': '改了 {n} 项',
      'req.noChange': '命中，无需修改',
      'req.noMatch': '没有规则命中',
      'req.paused': '已暂停',
      'req.notApplied': '没能应用',
      'req.networkError': '连接失败',
      'req.aborted': '已取消',
      'req.matched': '命中的规则',
      'req.duration': '{ms} 毫秒',
      'req.failed': '没能应用规则，请求原样发出：{reason}',
      'req.networkDetail': '连接失败：{reason}',
      'req.errorText': '网关返回的内容',
      'req.rejectedHint': '网关拒绝了这条被修改过的请求。先看上面改了哪些字段、网关是否支持；也可以先暂停全部规则，确认是不是它们引起的',
      'req.pauseAll': '暂停全部规则',
      'req.mentions': '网关的报错里提到了规则设置的字段：{fields}。它们很可能就是被拒绝的原因',
      'try.intro': '用一个示例请求试试规则，不会真的发出去',
      'try.url': '请求地址',
      'try.body': '请求体 (JSON)',
      'try.bodyHint': '只在这里处理，不会发送，也不会写进磁盘',
      'try.session': '会话 ID（可选）',
      'try.sessionHint': '用来看 {{session}} 会变成什么',
      'try.run': '试运行',
      'try.reset': '还原示例',
      'try.useDraft': '用未保存的修改',
      'try.paused': '全部规则已暂停，所以请求不会被修改',
      'try.notModelEndpoint': '这个地址看起来不是模型接口（…/chat/completions、…/messages、…/responses）。规则默认只作用于模型接口；要用在别的接口，请在规则里写上路径',
      'try.noMatch': '没有规则命中这个请求。检查一下主机、模型和路径',
      'try.unchanged': '命中的规则没有改变请求（里面的值本来就有）',
      'try.resultBody': '处理后的请求体',
      'try.resultHeaders': '请求头的变化',
      'import.title': '导入规则',
      'import.hint': '粘贴导出的 JSON，或选一个文件。导入的规则先放进草稿，保存后才生效',
      'import.read': '读取',
      'import.file': '选择文件…',
      'import.found': '读到 {n} 条规则：',
      'import.found.one': '读到 1 条规则：',
      'import.problems': '其中 {n} 条有问题，修正后才能保存',
      'import.problems.one': '其中 1 条有问题，修正后才能保存',
      'import.unsaved': '导入之后还要点保存才会生效',
      'import.append': '追加到现有规则',
      'import.replace': '替换全部规则',
      'import.confirmReplace': '用导入的规则替换现有的全部规则？',
      'import.empty': '没有读到规则',
      'import.applied': '已导入到草稿，检查后点保存',
      'import.tooLarge': '文件太大（超过 2 MB）',
      'import.unreadable': '读不了这个文件',
      'help.title': '它是怎么工作的',
      'help.what': '每个发给模型的请求，在发出前按你的规则加上指定的字段和请求头：OpenRouter 的 provider 路由、reasoning、备用模型，或任何网关接受的 JSON 字段。',
      'help.how': '规则从上到下应用，靠后的能看到前面的结果。默认只作用于模型接口（…/chat/completions、…/messages、…/responses），可按主机、模型、路径限定。官方 DeepSeek 接口，以及 llm-pi-ai 里的 OpenAI 兼容和 Anthropic 兼容渠道都适用。',
      'help.templates': '值里可以写 {{model}}（当前模型）、{{session}}（会话 ID）、{{env:名称}}（环境变量，适合放密钥，值不会显示）。',
      'help.safety': '为安全起见：messages、tools、model 等核心字段默认不能改，Authorization、x-api-key 等认证头永远不能改。规则出了问题，请求会原样发出，不会被拦住。',
      'help.privacy': '规则保存在本机配置目录的 .dsh-request-params/config.json。请求记录只在内存里，不写入磁盘；不保存对话内容，只有请求出错时会留下网关返回的前 2 KB 文字。只有「看看这个模型有哪些供应商」会访问 OpenRouter 公开的目录接口，不带任何密钥和内容。',
      'save.bar': '保存修改',
      'save.unsaved': '有未保存的修改',
      'save.hint': '按 Ctrl/⌘ + S 保存',
      'save.save': '保存',
      'save.saving': '保存中…',
      'save.discard': '放弃修改',
      'save.confirmDiscard': '放弃所有未保存的修改？',
      'save.blocked': '有 {n} 条启用的规则存在问题，修正后才能保存',
      'save.blocked.one': '有 1 条启用的规则存在问题，修正后才能保存',
      'save.building': '正在生成…',
      'conflict.text': '规则文件在你编辑期间被别处改动了（另一个页面或手动修改）',
      'conflict.reload': '载入最新版（放弃我的修改）',
      'conflict.overwrite': '以我的修改为准',
      'damaged.title': '规则文件读不了，所以现在没有任何规则在生效',
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
      'intro': 'Add your own parameters to every model request: OpenRouter provider routing, extra body fields, and headers, all set up here',
      'refresh': 'Refresh',
      'retry': 'Retry',
      'dismiss': 'Dismiss',
      'close': 'Close',
      'cancel': 'Cancel',
      'add': 'Add',
      'undo': 'Undo',
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
      'master.pause': 'Pause all rules',
      'master.resume': 'Resume all rules',
      'master.pausedDone': 'Paused: no rule changes a request now',
      'master.resumed': 'Resumed: rules apply from the next request',
      'status.paused': 'Paused · no rule changes any request',
      'status.noRules': 'No rule is active yet',
      'status.active': '{n} active rules',
      'status.active.one': '1 active rule',
      'status.last': 'Last model request {ago}: {result}',
      'status.lastApplied': 'added {n} changes',
      'status.lastApplied.one': 'added 1 change',
      'status.lastPaused': 'unchanged while paused',
      'status.lastPlain': 'no rule matched',
      'tabs.label': 'View',
      'tabs.rules': 'Rules',
      'tabs.requests': 'Recent requests',
      'tabs.try': 'Try it',
      'import.button': 'Import',
      'export.button': 'Export',
      'help.button': 'Help',
      'rules.order': 'Rules apply from top to bottom; a later rule sees what the earlier ones did. Changes take effect after you save.',
      'rule.new': 'New rule',
      'rule.unnamed': 'Untitled rule',
      'rule.noHost': 'no host yet',
      'rule.empty': 'nothing set yet',
      'rule.fields': '{n} fields',
      'rule.fields.one': '1 field',
      'rule.removes': '{n} removed',
      'rule.headers': '{n} headers',
      'rule.headers.one': '1 header',
      'rule.enable': 'Turn on "{name}"',
      'rule.disable': 'Turn off "{name}"',
      'rule.problems': '{n} problems',
      'rule.problems.one': '1 problem',
      'rule.hits': 'changed {n}×',
      'rule.hitsTitle': 'This rule changed {n} of the recent requests',
      'rule.name': 'Name',
      'rule.namePlaceholder': 'For example: only DeepInfra',
      'rule.note': 'Note (optional)',
      'rule.notePlaceholder': 'For future you: why this rule exists',
      'rule.duplicate': 'Duplicate',
      'rule.moveUp': 'Move up',
      'rule.moveDown': 'Move down',
      'rule.delete': 'Delete',
      'rule.confirmDelete': 'Delete the rule "{name}"? You can undo right after, or discard the whole draft',
      'rule.deleted': 'Deleted "{name}"',
      'rule.copyName': '{name} (copy)',
      'limit.rules': 'At most {n} rules',
      'empty.title': 'No rules yet',
      'empty.body': 'Pick one to start. Rules only add fields and headers to requests sent to a model; they never read or store your conversation.',
      'gallery.title': 'New rule',
      'channels.title': 'Configured channels',
      'channels.titleCount': 'Configured channels · {n}',
      'channels.hint': 'The model channels dsh already has. Make a rule for one without typing its host',
      'channels.loading': 'Reading the configured channels…',
      'channels.failed': 'Could not read the configured channels: {reason}',
      'channels.unavailable': 'This dsh does not list its channels here; make a rule from an endpoint under Recent requests',
      'channels.none': 'No model channel is configured yet',
      'channels.noHost': 'Endpoint unknown; send a message through this channel first',
      'channels.models': '{n} models',
      'channels.models.one': '1 model',
      'channels.rules': '{n} rules',
      'channels.rules.one': '1 rule',
      'channels.make': 'Make a rule',
      'channels.more': 'Other parameters',
      'channels.routing': 'Set up routing',
      'channels.seen': 'requests seen',
      'channels.source.settings': 'from channel settings',
      'channels.source.default': 'default endpoint',
      'channels.source.environment': 'from the environment',
      'channels.source.seen': 'from requests',
      'channels.source.unknown': 'endpoint unknown',
      'channels.modelsError': 'Could not list the models: {reason}',
      'gallery.forChannel': 'Rule for "{name}": applies to {where} only',
      'match.fromChannel': 'Add from a configured channel…',
      'gallery.popular': 'Popular',
      'gallery.recipes': 'Examples for other gateways (edit freely after creating)',
      'recipe.vllm-thinking.name': 'vLLM / Qwen3: turn thinking off',
      'recipe.vllm-thinking.desc': 'Pass chat_template_kwargs to your own vLLM server so models such as Qwen3 skip thinking; fill in your server host after creating',
      'recipe.vllm-thinking.example': 'chat_template_kwargs: { enable_thinking: false }',
      'recipe.helicone.name': 'Helicone observability',
      'recipe.helicone.desc': 'Send Helicone auth, session, and custom property headers; the key is read from the HELICONE_API_KEY environment variable',
      'recipe.helicone.example': 'Helicone-Session-Id: {{session}}',
      'recipe.cloudflare.name': 'Cloudflare AI Gateway cache',
      'recipe.cloudflare.desc': 'Set the gateway cache lifetime and tag requests with the session ID',
      'recipe.cloudflare.example': 'cf-aig-cache-ttl: 3600',
      'recipe.openai-cache.name': 'OpenAI prompt cache key',
      'recipe.openai-cache.desc': 'Use the session ID as prompt_cache_key so one conversation hits the cache more often',
      'recipe.openai-cache.example': 'prompt_cache_key: "{{session}}"',
      'preset.openrouter-routing.name': 'OpenRouter provider routing',
      'preset.openrouter-routing.desc': 'Choose providers, their order, price caps, zero data retention, and fallback models',
      'preset.openrouter-routing.example': 'provider: { order: ["deepinfra"], … }',
      'preset.reasoning.name': 'Reasoning effort',
      'preset.reasoning.desc': 'Set reasoning effort or budget, or leave the reasoning out of the reply',
      'preset.reasoning.example': 'reasoning: { effort: "high" }',
      'preset.sampling.name': 'Sampling extras',
      'preset.sampling.desc': 'Non-standard sampling fields such as top_k, min_p, top_a, repetition_penalty',
      'preset.sampling.example': 'top_k: 40, min_p: 0.05',
      'preset.session.name': 'Session stickiness',
      'preset.session.desc': 'Send the session ID so one conversation sticks to one provider and caches better',
      'preset.session.example': 'session_id: "{{session}}"',
      'preset.attribution.name': 'App attribution',
      'preset.attribution.desc': 'OpenRouter credits traffic to your app through HTTP-Referer and a title',
      'preset.attribution.example': 'X-OpenRouter-Title: My App',
      'preset.strip.name': 'Remove fields',
      'preset.strip.desc': 'Drop fields a gateway rejects (such as store) before the request leaves',
      'preset.strip.example': 'remove: ["store"]',
      'preset.custom.name': 'Custom rule',
      'preset.custom.desc': 'Write the JSON fields and headers yourself; works with any gateway',
      'preset.custom.example': '{ "your_field": "value" }',
      'params.custom': 'What to add',
      'match.title': 'Applies to',
      'match.hosts': 'Hosts',
      'match.hostsHint': 'The rule works only for requests sent to these hosts, such as openrouter.ai or *.example.com (*.x also covers x itself). Without a port, any port matches',
      'match.models': 'Models (optional)',
      'match.modelsHint': 'Empty = every model. Wildcards work: deepseek/*, *-chat',
      'match.paths': 'Paths (optional)',
      'match.pathsHint': 'Empty = model endpoints only (…/chat/completions, …/messages, …/responses). A path matches by prefix and also lets the rule reach other endpoints',
      'route.order': 'Provider order',
      'route.orderHint': 'Tried in this order. Use the provider slug (deepinfra), optionally with a variant (deepinfra/fp4)',
      'route.providerPlaceholder': 'Type a provider, e.g. deepinfra',
      'route.only': 'Only these',
      'route.onlyHint': 'Every other provider is skipped',
      'route.ignore': 'Never these',
      'route.ignoreHint': 'These providers are skipped for this request',
      'route.fallbacks': 'Allow other providers when these fail',
      'route.fallbacksHint': 'Off: the request fails if none of the chosen providers can serve it',
      'route.require': 'Only providers that support every parameter in the request',
      'route.requireHint': 'Otherwise unsupported parameters are quietly ignored',
      'route.zdr': 'Only zero data retention (ZDR) providers',
      'route.zdrHint': 'The provider keeps neither your prompt nor the answer',
      'route.sort': 'Sort by',
      'route.sortHint': 'By default requests are load balanced by price',
      'route.sortDefault': 'Default',
      'route.sortPrice': 'Price',
      'route.sortThroughput': 'Throughput',
      'route.sortLatency': 'Latency',
      'route.models': 'Fallback models',
      'route.modelsHint': 'If the main model is unavailable, these are tried in order',
      'route.moreOptions': 'More filters…',
      'route.lessOptions': 'Fewer filters',
      'route.data': 'Data collection',
      'route.dataHint': 'Whether providers that may store request data can be used',
      'route.dataDefault': 'Not set',
      'route.dataAllow': 'Allow',
      'route.dataDeny': 'Deny',
      'route.quant': 'Quantization',
      'route.quantHint': 'Only endpoints at these precisions; none selected = any',
      'route.maxPrompt': 'Max input price',
      'route.maxCompletion': 'Max output price',
      'route.perMillion': 'USD per million tokens',
      'route.minThroughput': 'Preferred minimum throughput',
      'route.maxLatency': 'Preferred maximum latency',
      'route.perfHint': 'A preference only: providers that meet it go first, nothing is refused because of it',
      'route.seconds': 'seconds',
      'route.distillable': 'Only models that allow distilling text',
      'route.distillableHint': 'enforce_distillable_text',
      'route.bundled': 'OpenRouter could not be reached; showing the built-in provider list ({date})',
      'route.noTraffic': 'No request to openrouter.ai has been seen yet. The rule works once you chat through an OpenRouter route (add openrouter to llm-pi-ai first; see the plugin README)',
      'explore.title': 'See which providers serve a model',
      'explore.show': 'Show',
      'explore.hint': 'Enter an OpenRouter model ID to list providers with price and speed, then add them to the lists above in one click',
      'explore.loading': 'Looking it up…',
      'explore.count': '{n} endpoints',
      'explore.count.one': '1 endpoint',
      'explore.stale': 'OpenRouter could not be reached; showing a cached answer',
      'explore.none': 'OpenRouter lists no endpoints for this model',
      'explore.priceTitle': 'Input / output, USD per million tokens',
      'explore.col.provider': 'Provider',
      'explore.col.quant': 'Quant',
      'explore.col.price': 'Price in/out',
      'explore.col.context': 'Context',
      'explore.col.uptime': 'Uptime',
      'explore.col.speed': 'Speed',
      'explore.col.route': 'Route',
      'explore.addOrder': 'Add to order',
      'explore.addOnly': 'Only',
      'explore.addIgnore': 'Never',
      'reasoning.effort': 'Reasoning effort',
      'reasoning.effortHint': 'xhigh thinks the most, none turns it off; OpenRouter ignores it for models without reasoning',
      'reasoning.maxTokens': 'Reasoning token budget',
      'reasoning.maxTokensHint': 'For models that take a budget; use this or the effort, not both',
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
      'session.body': 'Add session_id to the body',
      'session.bodyHint': 'The value is {{session}}, the dsh session ID',
      'session.header': 'Add the x-session-id header',
      'session.headerHint': 'The same session ID; some gateways use it for cache affinity',
      'attr.title': 'App name',
      'attr.titleHint': 'Sent as the X-OpenRouter-Title header',
      'attr.referer': 'App URL',
      'attr.refererHint': 'Sent as the HTTP-Referer header',
      'strip.fields': 'Fields to remove',
      'strip.hint': 'Use dots for nested fields, like stream_options.include_usage. Core fields such as messages and model cannot be removed here',
      'custom.merge': 'Fields to always set (JSON)',
      'custom.mergeHint': 'Written to the body every time; objects merge with what is there, anything else is replaced',
      'custom.defaults': 'Fields to set only when missing (JSON)',
      'custom.defaultsHint': 'A field the request already has is left alone',
      'custom.remove': 'Fields to remove',
      'custom.removeHint': 'Dotted paths, such as store or stream_options.include_usage. Removed first, then set',
      'custom.headers': 'Headers to add',
      'custom.headersHint': 'A header with the same name is replaced; Authorization and other credentials cannot be changed',
      'custom.removeHeaders': 'Headers to remove',
      'custom.removeHeadersHint': 'Names are not case sensitive',
      'custom.templates': 'Values may use: {{model}} the model · {{session}} the session ID · {{env:NAME}} an environment variable (put keys here; the value is never shown on this page or in the request log)',
      'custom.protected': 'Allow changing core fields',
      'custom.protectedHint': 'By default {fields} cannot be touched; with this on the rule may rewrite them, so be sure you know what it does',
      'headers.add': 'Add a header',
      'headers.name': 'Header name',
      'headers.value': 'Header value',
      'headers.valuePlaceholder': 'Value, may use {{env:KEY}}',
      'headers.remove': 'Remove header {name}',
      'env.set': 'Environment variable {name} is set',
      'env.unset': 'Environment variable {name} is not set: fields that use it are skipped',
      'generated.show': 'Show the generated JSON',
      'generated.hide': 'Hide',
      'generated.detach': 'Edit by hand instead',
      'generated.empty': 'Nothing yet',
      'generated.confirmDetach': 'After you edit by hand this rule loses the form above and can only be changed as JSON. Continue?',
      'problem.no-host': 'No host yet',
      'problem.bad-host': 'Not a valid host: {detail}',
      'problem.too-large': 'Too large',
      'problem.too-deep': 'Nested too deeply',
      'problem.bad-key': 'Field name not allowed: {detail}',
      'problem.protected': 'Core field {detail} cannot be changed (tick "Allow changing core fields" in a custom rule)',
      'problem.template-env-name': 'Not a valid environment variable name: {detail}',
      'problem.template-unknown': 'Unknown template variable: {detail} (use model, session, or env:NAME)',
      'problem.bad-path': 'Not a valid path to remove: {detail}',
      'problem.bad-header': 'Not a valid header name: {detail}',
      'problem.forbidden-header': 'The header {detail} cannot be changed (credentials and transport)',
      'problem.bad-header-value': 'The value of header {detail} cannot contain a line break',
      'problem.duplicate-header': 'The header {detail} appears twice',
      'invalid.rule': 'The rule "{rule}" matched this request but has problems, so it was not applied: {problems}',
      'skipped.env-missing': 'In the rule "{rule}", {field} uses the environment variable {name}, which is not set, so it was skipped',
      'skipped.bad-value': 'In the rule "{rule}", the value of header {name} has a line break, so it was skipped',
      'change.set': 'Set',
      'change.default': 'Default',
      'change.remove': 'Remove',
      'change.header': 'Header',
      'change.header-remove': 'Remove header',
      'change.secret': '(from an environment variable, not shown)',
      'change.more': '{n} more',
      'req.intro': 'The model requests dsh sent recently, kept in memory only and cleared on restart. Each entry has the model, address, and changes; when a request fails it also keeps the first 2 KB of what the gateway answered (which may quote the request)',
      'req.clear': 'Clear',
      'req.endpoints': 'Model endpoints seen',
      'req.count': '{n} requests',
      'req.count.one': '1 request',
      'req.makeRule': 'Make a rule',
      'req.emptyTitle': 'No model requests yet',
      'req.emptyHint': 'Send a message and the request shows up here, with whether a rule applied and what the gateway answered',
      'req.noModel': '(no model name)',
      'req.applied': 'changed {n}',
      'req.noChange': 'matched, nothing to change',
      'req.noMatch': 'no rule matched',
      'req.paused': 'paused',
      'req.notApplied': 'not applied',
      'req.networkError': 'failed',
      'req.aborted': 'cancelled',
      'req.matched': 'Matched rules',
      'req.duration': '{ms} ms',
      'req.failed': 'The rules could not be applied, so the request went out unchanged: {reason}',
      'req.networkDetail': 'The connection failed: {reason}',
      'req.errorText': 'What the gateway answered',
      'req.rejectedHint': 'The gateway rejected this modified request. Check the fields changed above and whether the gateway supports them; or pause all rules to see if they are the cause',
      'req.pauseAll': 'Pause all rules',
      'req.mentions': 'The error text mentions fields that a rule set: {fields}. They are the likely reason for the refusal',
      'try.intro': 'Try the rules on a sample request. Nothing is sent',
      'try.url': 'Request URL',
      'try.body': 'Request body (JSON)',
      'try.bodyHint': 'Handled here only: it is not sent and not written to disk',
      'try.session': 'Session ID (optional)',
      'try.sessionHint': 'To see what {{session}} becomes',
      'try.run': 'Try it',
      'try.reset': 'Reset sample',
      'try.useDraft': 'Use unsaved changes',
      'try.paused': 'All rules are paused, so the request is not changed',
      'try.notModelEndpoint': 'This URL does not look like a model endpoint (…/chat/completions, …/messages, …/responses). Rules only reach model endpoints unless they name a path',
      'try.noMatch': 'No rule matched this request. Check the host, model, and path',
      'try.unchanged': 'The matching rules changed nothing (the request already has those values)',
      'try.resultBody': 'Request body after the rules',
      'try.resultHeaders': 'Header changes',
      'import.title': 'Import rules',
      'import.hint': 'Paste exported JSON or choose a file. Imported rules go into the draft and take effect after you save',
      'import.read': 'Read',
      'import.file': 'Choose a file…',
      'import.found': 'Found {n} rules:',
      'import.found.one': 'Found 1 rule:',
      'import.problems': '{n} of them have problems and need fixing before you can save',
      'import.problems.one': '1 of them has problems and needs fixing before you can save',
      'import.unsaved': 'Click Save afterwards to make them live',
      'import.append': 'Add to current rules',
      'import.replace': 'Replace all rules',
      'import.confirmReplace': 'Replace all current rules with the imported ones?',
      'import.empty': 'No rules found',
      'import.applied': 'Imported into the draft. Check it, then Save',
      'import.tooLarge': 'File is too large (over 2 MB)',
      'import.unreadable': 'Could not read that file',
      'help.title': 'How it works',
      'help.what': 'Before each request goes to a model, your rules add the fields and headers you chose: OpenRouter provider routing, reasoning, fallback models, or any JSON field a gateway accepts.',
      'help.how': 'Rules apply top to bottom and a later one sees what the earlier ones did. By default they reach model endpoints only (…/chat/completions, …/messages, …/responses) and can be limited by host, model, and path. It works with the official DeepSeek endpoint and with the OpenAI-compatible and Anthropic-compatible providers in llm-pi-ai.',
      'help.templates': 'Values may use {{model}} (the model), {{session}} (the session ID), and {{env:NAME}} (an environment variable; good for keys, never shown).',
      'help.safety': 'For safety, core fields such as messages, tools, and model cannot be changed unless a custom rule opts in, and credential headers such as Authorization and x-api-key can never be changed. If a rule has a problem the request goes out unchanged instead of being blocked.',
      'help.privacy': 'Rules are stored in .dsh-request-params/config.json next to your profile. The request log lives in memory and is never written to disk; it keeps no conversation text, only the first 2 KB of an error the gateway returned. Only "See which providers serve a model" contacts OpenRouter, using its public catalog and sending no keys or content.',
      'save.bar': 'Save changes',
      'save.unsaved': 'Unsaved changes',
      'save.hint': 'Press Ctrl/⌘ + S to save',
      'save.save': 'Save',
      'save.saving': 'Saving…',
      'save.discard': 'Discard',
      'save.confirmDiscard': 'Discard all unsaved changes?',
      'save.blocked': '{n} enabled rules have problems; fix them to save',
      'save.blocked.one': '1 enabled rule has problems; fix it to save',
      'save.building': 'Building…',
      'conflict.text': 'The rules file changed while you were editing (another page or a hand edit)',
      'conflict.reload': 'Load the latest (drop my changes)',
      'conflict.overwrite': 'Keep my changes',
      'damaged.title': 'The rules file cannot be read, so no rule is active right now',
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
.rp { --rp-r-sm: var(--dsw-radius-sm, 8px); --rp-r-md: var(--dsw-radius-md, 12px); --rp-tint: var(--dsw-alias-interactive-bg-hover); --rp-mono: var(--dsw-font-mono, ui-monospace, monospace); box-sizing: border-box; height: 100%; overflow-y: auto; color: var(--dsw-alias-label-primary); font-size: 13px; }
.rp-inner { container-type: inline-size; box-sizing: border-box; max-width: 900px; margin: 0 auto; padding: 28px 32px 40px; display: flex; flex-direction: column; gap: 14px; }
.rp h1 { margin: 0; display: flex; align-items: baseline; gap: 10px; font-size: 20px; font-weight: 500; line-height: 28px; }
.rp-version { font-size: 12px; font-weight: 400; color: var(--dsw-alias-label-tertiary); }
.rp-sub { margin: 4px 0 0; color: var(--dsw-alias-label-secondary); line-height: 1.5; }
.rp-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px 24px; flex-wrap: wrap; }
.rp-titlebar { min-width: 0; flex: 1 1 360px; }
.rp-master { display: inline-flex; align-items: center; gap: 8px; padding: 4px 0; cursor: pointer; color: var(--dsw-alias-label-secondary); }
.rp-toolbar { display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; }
.rp-tools { display: flex; align-items: center; gap: 2px; flex-wrap: wrap; margin-right: -12px; }
.rp-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.rp-end { justify-content: flex-end; }
.rp-grow { flex: 1 1 auto; min-width: 0; }
.rp-input { box-sizing: border-box; min-width: 0; height: 32px; font: inherit; padding: 0 10px; border-radius: var(--rp-r-sm); border: .5px solid var(--dsw-alias-border-l3); background: var(--dsw-alias-bg-layer-1); color: inherit; flex: 1 1 200px; }
.rp-input.is-bad { border-color: var(--dsw-alias-state-danger-primary, #d93025); }
.rp-mono { font-family: var(--rp-mono); font-size: 12px; }
.rp-textarea { height: auto; padding: 8px 10px; min-height: 90px; width: 100%; font-family: var(--rp-mono); font-size: 12px; line-height: 1.5; resize: vertical; flex: none; }
.rp-btn { display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; height: 30px; font: inherit; font-size: 12px; padding: 0 12px; border-radius: var(--rp-r-sm); border: .5px solid var(--dsw-alias-border-l3); background: transparent; color: inherit; cursor: pointer; white-space: nowrap; }
.rp-btn:disabled { opacity: .5; cursor: default; }
.rp-btn.is-small { height: 24px; padding: 0 8px; font-size: 11px; }
.rp-btn.is-ghost { border-color: transparent; color: var(--dsw-alias-label-secondary); }
.rp-btn.is-ghost[aria-expanded="true"] { background: var(--rp-tint); color: var(--dsw-alias-label-primary); }
.rp-primary { background: var(--dsw-alias-button-primary-fill); border-color: transparent; color: var(--dsw-alias-bg-layer-1); }
.rp-danger { color: var(--dsw-alias-state-danger-primary, #d93025); }
.rp-link { align-self: flex-start; font: inherit; font-size: 12px; padding: 0; border: 0; background: none; color: var(--dsw-alias-state-business-primary); cursor: pointer; }
.rp-iconbtn { flex: none; width: 24px; height: 24px; padding: 0; font: inherit; line-height: 1; border: 0; border-radius: var(--rp-r-sm); background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; }
.rp-iconbtn:disabled { opacity: .35; cursor: default; }
.rp-hidden { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.rp-hint { color: var(--dsw-alias-label-tertiary); font-size: 12px; line-height: 1.5; }
.rp-hint.is-error { color: var(--dsw-alias-state-danger-primary, #d93025); }
.rp-hint.is-warn { color: var(--dsw-alias-state-warn-primary); }
.rp-dim { color: var(--dsw-alias-label-tertiary); }
.rp-label { font-size: 12px; color: var(--dsw-alias-label-secondary); }
.rp-note { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 8px 10px; border-radius: var(--rp-r-sm); background: var(--rp-tint); font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-secondary); }
.rp-note.is-warn { color: var(--dsw-alias-state-warn-primary); }
.rp-note.is-done { color: var(--dsw-alias-state-success-primary); }
.rp-note.is-float { position: sticky; bottom: 16px; z-index: 6; background: var(--dsw-alias-bg-layer-1); border: .5px solid var(--dsw-alias-border-l3); box-shadow: 0 4px 16px rgba(0, 0, 0, .12); }
.rp-note.is-float.is-above { bottom: 76px; }
.rp-status { padding: 8px 12px; flex-wrap: nowrap; }
.rp-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-border-l3); }
.rp-dot.is-on { background: var(--dsw-alias-state-success-primary, #2da44e); }
.rp-list { display: flex; flex-direction: column; gap: 8px; }
.rp-row { border: .5px solid var(--dsw-alias-settings-card-stroke, var(--dsw-alias-border-l3)); border-radius: var(--rp-r-md); background: var(--dsw-alias-settings-card-fill, transparent); }
.rp-row.is-off .rp-name, .rp-row.is-off .rp-meta { opacity: .55; }
.rp-top { display: flex; align-items: center; border-radius: var(--rp-r-md); }
.rp-switchcell { flex: none; padding-left: 12px; display: flex; align-items: center; }
.rp-head { flex: 1 1 auto; min-width: 0; display: flex; gap: 10px; align-items: center; box-sizing: border-box; padding: 10px 12px; font: inherit; text-align: left; border: 0; border-radius: var(--rp-r-md); background: none; color: inherit; cursor: pointer; }
.rp-requesthead { width: 100%; }
.rp-name { flex: none; max-width: 40%; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
.rp-name.is-dim { font-weight: 400; color: var(--dsw-alias-label-tertiary); }
.rp-meta { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-tertiary); font-size: 12px; }
.rp-row.is-open .rp-meta { visibility: hidden; }
.rp-chip { display: inline-flex; align-items: center; gap: 2px; max-width: 100%; font-size: 12px; line-height: 20px; padding: 0 4px 0 8px; border-radius: var(--rp-r-sm); background: var(--rp-tint); }
.rp-chip.is-plain { flex: none; padding: 0 8px; font-size: 11px; color: var(--dsw-alias-label-secondary); }
.rp-chiptext { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--rp-mono); font-size: 11px; }
.rp-chipx { flex: none; width: 18px; height: 18px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--dsw-alias-label-tertiary); font: inherit; line-height: 1; cursor: pointer; }
.rp-badge { flex: none; font-size: 11px; line-height: 18px; padding: 0 7px; border-radius: var(--rp-r-sm); background: var(--rp-tint); color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.rp-badge.is-accent { color: var(--dsw-alias-state-business-primary); }
.rp-badge.is-ok { color: var(--dsw-alias-state-success-primary); }
.rp-badge.is-warn { color: var(--dsw-alias-state-warn-primary); }
.rp-badge.is-error { color: var(--dsw-alias-state-danger-primary, #d93025); }
.rp-caret { flex: none; color: var(--dsw-alias-label-tertiary); transition: transform .16s; }
.rp-row.is-open > .rp-top .rp-caret, .rp-row.is-open > .rp-requesthead .rp-caret { transform: rotate(90deg); }
.rp-body { display: flex; flex-direction: column; gap: 14px; padding: 2px 14px 14px; }
.rp-section { display: flex; flex-direction: column; gap: 8px; }
.rp-body > .rp-section { padding-top: 14px; border-top: .5px solid var(--dsw-alias-border-l3); }
.rp-sectiontitle { font-size: 12px; font-weight: 500; color: var(--dsw-alias-label-secondary); }
.rp-formgrid { display: flex; gap: 12px 16px; flex-wrap: wrap; }
.rp-field { display: flex; flex-direction: column; gap: 4px; flex: 1 1 240px; min-width: 0; }
.rp-field.is-wide { flex: 1 1 100%; }
.rp-field > .rp-input, .rp-field > .rp-textarea { flex: none; width: 100%; }
.rp input[list]::-webkit-calendar-picker-indicator { display: none !important; }
.rp-unit { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rp-unit .rp-input { flex: 0 1 140px; }
.rp-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; box-sizing: border-box; min-height: 32px; padding: 3px 6px; border-radius: var(--rp-r-sm); border: .5px solid var(--dsw-alias-border-l3); background: var(--dsw-alias-bg-layer-1); cursor: text; }
.rp-chips:focus-within { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 1px; }
.rp-chipinput { flex: 1 1 120px; min-width: 80px; height: 24px; padding: 0 4px; font: inherit; border: 0; outline: 0; background: transparent; color: inherit; }
.rp-order { display: flex; flex-direction: column; gap: 6px; }
.rp-orderlist { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; }
.rp-orderitem { display: flex; align-items: center; gap: 6px; padding: 3px 4px 3px 8px; border-radius: var(--rp-r-sm); background: var(--rp-tint); }
.rp-ordernum { flex: none; width: 18px; color: var(--dsw-alias-label-tertiary); font-size: 11px; text-align: center; }
.rp-orderlabel { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rp-orderlabel code { font-family: var(--rp-mono); font-size: 12px; }
.rp-checks { display: flex; flex-direction: column; gap: 8px; }
.rp-check { display: flex; gap: 8px; align-items: flex-start; cursor: pointer; }
.rp-check input { margin: 3px 0 0; }
.rp-checktext { display: flex; flex-direction: column; gap: 2px; }
.rp-toggles { display: flex; flex-wrap: wrap; gap: 6px; }
.rp-toggle { font: inherit; font-family: var(--rp-mono); font-size: 11px; padding: 2px 9px; border-radius: 999px; border: .5px solid var(--dsw-alias-border-l3); background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; }
.rp-toggle[aria-pressed="true"] { background: var(--rp-tint); color: var(--dsw-alias-state-business-primary); border-color: var(--dsw-alias-state-business-primary); }
.rp-seg { display: inline-flex; align-self: flex-start; flex-wrap: wrap; border: .5px solid var(--dsw-alias-border-l3); border-radius: var(--rp-r-sm); overflow: hidden; }
.rp-seg button { font: inherit; font-size: 12px; padding: 5px 12px; border: 0; background: transparent; color: inherit; cursor: pointer; }
.rp-seg button[aria-checked="true"] { background: var(--rp-tint); font-weight: 500; }
.rp-seg button:focus-visible { outline-offset: -2px; }
.rp-switch { flex: none; position: relative; width: 30px; height: 18px; padding: 0; border: 0; border-radius: 9px; background: var(--dsw-alias-border-l3); cursor: pointer; transition: background .16s; }
.rp-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, .2); transition: transform .16s; }
.rp-switch[aria-checked="true"] { background: var(--dsw-alias-state-business-primary); }
.rp-switch[aria-checked="true"]::after { transform: translateX(12px); }
.rp-switch:disabled { opacity: .4; cursor: default; }
.rp-headerrow { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }
.rp-headerrow .rp-input:first-child { flex: 0 1 200px; }
.rp-envs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.rp-problems { margin: 0; padding-left: 18px; }
.rp-pre { margin: 0; max-height: 280px; overflow: auto; padding: 8px 10px; border-radius: var(--rp-r-sm); background: var(--rp-tint); white-space: pre-wrap; overflow-wrap: anywhere; font-family: var(--rp-mono); font-size: 12px; line-height: 1.5; }
.rp-diff { max-height: 440px; padding: 4px 0; white-space: pre; overflow-wrap: normal; }
.rp-diffline { display: flex; gap: 8px; padding: 0 10px; }
.rp-diffline.is-add { background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #2da44e) 16%, transparent); }
.rp-diffline.is-del { background: color-mix(in srgb, var(--dsw-alias-state-danger-primary, #d93025) 14%, transparent); text-decoration: line-through; opacity: .85; }
.rp-diffsign { flex: none; width: 10px; color: var(--dsw-alias-label-tertiary); }
.rp-changes { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; }
.rp-change { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; font-size: 12px; }
.rp-sign { flex: none; min-width: 22px; text-align: center; font-weight: 600; color: var(--dsw-alias-state-business-primary); }
.rp-change.is-remove .rp-sign, .rp-change.is-header-remove .rp-sign { color: var(--dsw-alias-state-danger-primary, #d93025); }
.rp-change.is-default .rp-sign { color: var(--dsw-alias-label-tertiary); }
.rp-changepath, .rp-changevalue { font-family: var(--rp-mono); font-size: 12px; overflow-wrap: anywhere; }
.rp-changevalue { color: var(--dsw-alias-label-secondary); }
.rp-panel { display: flex; flex-direction: column; gap: 12px; padding: 14px 16px; border-radius: var(--rp-r-md); border: .5px solid var(--dsw-alias-settings-card-stroke, var(--dsw-alias-border-l3)); background: var(--dsw-alias-settings-card-fill, transparent); }
.rp-panel:focus { outline: none; }
.rp-helpp { margin: 0; line-height: 1.65; color: var(--dsw-alias-label-secondary); }
.rp-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; }
.rp-card { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; box-sizing: border-box; padding: 12px 14px; text-align: left; font: inherit; border-radius: var(--rp-r-md); border: .5px solid var(--dsw-alias-border-l3); background: var(--dsw-alias-settings-card-fill, transparent); color: inherit; cursor: pointer; }
.rp-card.is-featured { border-color: var(--dsw-alias-state-business-primary); }
.rp-cardtitle { display: flex; gap: 8px; align-items: center; font-weight: 500; }
.rp-carddesc { color: var(--dsw-alias-label-secondary); line-height: 1.5; }
.rp-cardcode { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--rp-mono); font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.rp-onboarding { display: flex; flex-direction: column; gap: 10px; padding: 8px 0; }
.rp-empty { display: flex; flex-direction: column; gap: 6px; align-items: center; padding: 28px 12px; text-align: center; border: 1px dashed var(--dsw-alias-border-l3); border-radius: var(--rp-r-md); }
.rp-emptytitle { font-size: 15px; font-weight: 500; }
.rp-endpoints { display: flex; flex-direction: column; gap: 6px; }
.rp-channelsbox { padding: 10px 12px; border-radius: var(--rp-r-md); border: .5px solid var(--dsw-alias-border-l3); }
.rp-grouphead { display: inline-flex; gap: 8px; align-items: center; padding: 2px 0; font: inherit; border: 0; background: none; color: inherit; cursor: pointer; text-align: left; }
.rp-grouphead[aria-expanded="true"] .rp-caret { transform: rotate(90deg); }
.rp-channels { display: flex; flex-direction: column; gap: 6px; }
.rp-channel { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--rp-r-sm); background: var(--rp-tint); }
.rp-channelmain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.rp-channeltitle { display: flex; gap: 8px; align-items: baseline; min-width: 0; }
.rp-channelname { font-weight: 500; }
.rp-channeltitle code, .rp-channelurl { font-family: var(--rp-mono); font-size: 12px; overflow-wrap: anywhere; }
.rp-channelmeta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.rp-select { flex: none; width: auto; max-width: 100%; margin-top: 6px; }
.rp-endpoint { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--rp-r-sm); border: .5px solid var(--dsw-alias-border-l3); }
.rp-endpointmain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.rp-endpointurl { font-family: var(--rp-mono); font-size: 12px; overflow-wrap: anywhere; }
.rp-explorer { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: var(--rp-r-sm); background: var(--rp-tint); }
.rp-tablewrap { overflow-x: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rp-table th { text-align: left; font-weight: 500; color: var(--dsw-alias-label-tertiary); padding: 4px 10px 6px 0; white-space: nowrap; }
.rp-table td { padding: 6px 10px 6px 0; border-top: .5px solid var(--dsw-alias-border-l3); vertical-align: top; white-space: nowrap; }
.rp-table code { font-family: var(--rp-mono); font-size: 11px; }
.rp-rowbtns { display: flex; gap: 4px; }
.rp-confirm { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: var(--rp-r-sm); background: var(--rp-tint); }
.rp-actionsbar { padding-top: 4px; }
.rp-savebar { position: sticky; bottom: 0; z-index: 7; padding: 10px 32px 14px; background: var(--dsw-alias-bg-layer-1); border-top: .5px solid var(--dsw-alias-border-l3); box-shadow: 0 -4px 16px rgba(0, 0, 0, .06); }
.rp-savebarinner { box-sizing: border-box; max-width: 836px; margin: 0 auto; display: flex; align-items: center; gap: 8px; }
.rp-savebar .rp-confirm { max-width: 836px; margin: 0 auto; }
.rp-skeleton { display: flex; flex-direction: column; gap: 8px; }
.rp-skeleton span { display: block; height: 44px; border-radius: var(--rp-r-md); background: var(--rp-tint); animation: rp-pulse .9s ease-in-out infinite alternate; }
.rp :is(button, input, select, textarea, [tabindex]):focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
@keyframes rp-pulse { from { opacity: .45 } to { opacity: .9 } }
@media (prefers-reduced-motion: reduce) { .rp-skeleton span { animation: none; } .rp-caret, .rp-switch, .rp-switch::after { transition: none; } }
@media (hover: hover) { .rp-head:hover, .rp-btn:hover:not(:disabled), .rp-seg button:hover, .rp-iconbtn:hover:not(:disabled), .rp-card:hover, .rp-toggle:hover, .rp-chipx:hover { background: var(--dsw-alias-interactive-bg-hover-accent, var(--rp-tint)); } .rp-primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover, var(--dsw-alias-button-primary-fill)); } .rp-link:hover { text-decoration: underline; } }
@container (max-width: 600px) { .rp-channel { flex-wrap: wrap; } .rp-narrow-hide { display: none; } .rp-name { max-width: none; flex: 1 1 auto; } .rp-formgrid { gap: 12px; } .rp-headerrow { flex-wrap: wrap; } .rp-headerrow .rp-input:first-child { flex: 1 1 100%; } }
@media (max-width: 640px) { .rp-inner { padding: 20px 16px 32px; } .rp-savebar { padding: 10px 16px 14px; } }
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

    function Seg({ value, options, onChange, label, small }) {
      return h('div', { className: `rp-seg${small ? ' is-small' : ''}`, role: 'radiogroup', 'aria-label': label, onKeyDown: radioKeys },
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
          h('button', { type: 'button', className: `rp-btn ${danger ? 'rp-danger' : 'rp-primary'}`, onClick: onConfirm }, action)))
    }

    function Field({ label, hint, error, htmlFor, children, wide }) {
      return h('div', { className: `rp-field${wide ? ' is-wide' : ''}` },
        label === undefined ? null : h('label', { className: 'rp-label', htmlFor }, label),
        children,
        error === undefined || error === null ? null : h('div', { className: 'rp-hint is-error', role: 'alert' }, error),
        hint === undefined ? null : h('div', { className: 'rp-hint' }, hint))
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
          h('span', { className: 'rp-chiptext' }, format === undefined ? item : format(item)),
          h('button', { type: 'button', className: 'rp-chipx', 'aria-label': ui.t('removeItem', { item }), onClick: (event) => { event.stopPropagation(); onChange(value.filter((_, at) => at !== index)) } }, '×'))),
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

    /** Values whose order matters: numbered rows with move and remove buttons, and a field to add one. */
    function OrderList({ ui, id, label, value, onChange, placeholder, listId, names = {} }) {
      const [text, setText] = React.useState('')
      const add = () => {
        const next = text.trim()
        setText('')
        if (next !== '' && !value.includes(next)) onChange([...value, next])
      }
      const move = (from, to) => {
        const next = [...value]
        const [item] = next.splice(from, 1)
        next.splice(to, 0, item)
        onChange(next)
      }
      return h('div', { className: 'rp-order' },
        value.length === 0 ? null : h('ol', { className: 'rp-orderlist' }, value.map((item, index) => h('li', { key: item, className: 'rp-orderitem' },
          h('span', { className: 'rp-ordernum' }, index + 1),
          h('span', { className: 'rp-orderlabel' }, names[item] === undefined ? h('code', null, item) : [names[item], ' ', h('code', { key: 'c', className: 'rp-dim' }, item)]),
          h('button', { type: 'button', className: 'rp-iconbtn', disabled: index === 0, 'aria-label': ui.t('moveUpItem', { item }), onClick: () => move(index, index - 1) }, '↑'),
          h('button', { type: 'button', className: 'rp-iconbtn', disabled: index === value.length - 1, 'aria-label': ui.t('moveDownItem', { item }), onClick: () => move(index, index + 1) }, '↓'),
          h('button', { type: 'button', className: 'rp-iconbtn', 'aria-label': ui.t('removeItem', { item }), onClick: () => onChange(value.filter((_, at) => at !== index)) }, '×')))),
        h('div', { className: 'rp-bar' },
          h('input', {
            id, className: 'rp-input', value: text, list: listId, placeholder, 'aria-label': label, autoComplete: 'off', spellCheck: false,
            onChange: event => setText(event.target.value),
            onKeyDown: (event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) { event.preventDefault(); add() } },
          }),
          h('button', { type: 'button', className: 'rp-btn', disabled: text.trim() === '', onClick: add }, ui.t('add'))))
    }

    /** A number typed as text, so a half-typed value is never rewritten under the cursor. */
    function NumberInput({ ui, id, value, onChange, placeholder, unit, integer }) {
      const raw = value === null || value === undefined ? '' : String(value)
      const bad = raw.trim() !== '' && !(integer ? /^\d+$/ : /^\d*\.?\d+$/).test(raw.trim())
      return h('div', { className: 'rp-unit' },
        h('input', { id, className: `rp-input${bad ? ' is-bad' : ''}`, inputMode: integer ? 'numeric' : 'decimal', value: raw, placeholder, 'aria-invalid': bad || undefined, onChange: event => onChange(event.target.value) }),
        unit === undefined ? null : h('span', { className: 'rp-dim' }, unit),
        bad ? h('span', { className: 'rp-hint is-error' }, ui.t(integer ? 'badInteger' : 'badNumber')) : null)
    }

    /** A JSON object edited as text; the text is kept while it is not valid, and only a valid object is passed on. */
    function JsonField({ ui, id, value, onChange, rows = 6, readOnly }) {
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
      return h('div', { className: 'rp-json' },
        h('textarea', {
          id, className: `rp-input rp-textarea${error === null ? '' : ' is-bad'}`, rows, value: text, readOnly, spellCheck: false, 'aria-invalid': error !== null || undefined,
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

    const QUANTIZATIONS = ['int4', 'int8', 'fp4', 'mxfp4', 'nvfp4', 'fp6', 'fp8', 'mxfp8', 'fp16', 'bf16', 'fp32', 'unknown']
    const EFFORTS = ['xhigh', 'high', 'medium', 'low', 'minimal', 'none']

    function Check({ checked, onChange, children, hint }) {
      return h('label', { className: 'rp-check' },
        h('input', { type: 'checkbox', checked, onChange: event => onChange(event.target.checked) }),
        h('span', { className: 'rp-checktext' }, children, hint === undefined ? null : h('span', { className: 'rp-hint' }, hint)))
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

    function priceText(endpoint) {
      const money = value => (value === null ? '–' : `$${value < 0.1 ? value.toPrecision(2) : value.toFixed(2)}`)
      return `${money(endpoint.prompt)} / ${money(endpoint.completion)}`
    }

    function contextText(value) {
      if (value === null) return '–'
      return value >= 1e6 ? `${(value / 1e6).toFixed(1)}M` : `${Math.round(value / 1000)}K`
    }

    /** Which providers serve one OpenRouter model, with price, speed, and a button to route to or away from each. */
    function ProviderExplorer({ ui, defaultModel, models, wantModels, onAdd }) {
      const { t } = ui
      const [model, setModel] = React.useState(defaultModel)
      const [state, setState] = React.useState({ kind: 'idle' })
      const seq = React.useRef(0)
      const run = (refresh) => {
        const id = model.trim()
        if (id === '') return
        const mine = ++seq.current
        setState({ kind: 'loading' })
        loadCatalog('orEndpoints', { model: id }, refresh).then(
          value => { if (mine === seq.current) setState({ kind: 'ok', value }) },
          error => { if (mine === seq.current) setState({ kind: 'error', error }) },
        )
      }
      // OpenRouter reports speed only to signed-in callers; without any figure the column would be a row of dashes.
      const hasSpeed = state.kind === 'ok' && state.value.endpoints.some(endpoint => endpoint.throughput !== null)
      return h('div', { className: 'rp-explorer' },
        h('div', { className: 'rp-label' }, t('explore.title')),
        h('div', { className: 'rp-bar' },
          h('input', {
            className: 'rp-input', value: model, list: 'rp-models', placeholder: 'deepseek/deepseek-chat', 'aria-label': t('explore.title'), autoComplete: 'off', spellCheck: false,
            onFocus: wantModels, onChange: event => setModel(event.target.value),
            onKeyDown: (event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) { event.preventDefault(); run(false) } },
          }),
          h('button', { type: 'button', className: 'rp-btn', disabled: model.trim() === '' || state.kind === 'loading', onClick: () => run(false) }, t('explore.show'))),
        h('datalist', { id: 'rp-models' }, (models?.models ?? []).slice(0, 800).map(item => h('option', { key: item.id, value: item.id }, item.name))),
        state.kind === 'idle' ? h('div', { className: 'rp-hint' }, t('explore.hint')) : null,
        state.kind === 'loading' ? h('div', { className: 'rp-hint', role: 'status' }, t('explore.loading')) : null,
        state.kind === 'error' ? h('div', { className: 'rp-hint is-error', role: 'alert' }, ui.describe(state.error)) : null,
        state.kind === 'ok' ? h('div', { className: 'rp-section' },
          h('div', { className: 'rp-hint' }, `${state.value.name} · ${pl(t, 'explore.count', state.value.endpoints.length)}${state.value.stale ? ` · ${t('explore.stale')}` : ''}`),
          state.value.endpoints.length === 0 ? h('div', { className: 'rp-hint' }, t('explore.none')) : h('div', { className: 'rp-tablewrap' },
            h('table', { className: 'rp-table' },
              h('thead', null, h('tr', null,
                ['explore.col.provider', 'explore.col.quant', 'explore.col.price', 'explore.col.context', 'explore.col.uptime', ...hasSpeed ? ['explore.col.speed'] : [], 'explore.col.route'].map(key => h('th', { key, scope: 'col' }, t(key))))),
              h('tbody', null, state.value.endpoints.map(endpoint => h('tr', { key: endpoint.tag },
                h('td', null, h('div', null, endpoint.provider), h('code', { className: 'rp-dim' }, endpoint.tag)),
                h('td', null, endpoint.quantization ?? '–'),
                h('td', { title: t('explore.priceTitle') }, priceText(endpoint)),
                h('td', null, contextText(endpoint.context)),
                h('td', null, endpoint.uptime === null ? '–' : `${endpoint.uptime.toFixed(1)}%`),
                hasSpeed ? h('td', null, endpoint.throughput === null ? '–' : `${Math.round(endpoint.throughput)} tok/s`) : null,
                h('td', null, h('div', { className: 'rp-rowbtns' },
                  h('button', { type: 'button', className: 'rp-btn is-small', onClick: () => onAdd('order', endpoint.tag) }, t('explore.addOrder')),
                  h('button', { type: 'button', className: 'rp-btn is-small', onClick: () => onAdd('only', endpoint.tag) }, t('explore.addOnly')),
                  h('button', { type: 'button', className: 'rp-btn is-small', onClick: () => onAdd('ignore', endpoint.tag) }, t('explore.addIgnore')))))))))) : null)
    }

    function RoutingForm({ ui, rule, form, set }) {
      const { t } = ui
      const [providers, setProviders] = React.useState(null)
      const [models, wantModels] = useModels()
      const [more, setMore] = React.useState(() => form.quantizations.length > 0 || form.maxPrompt !== null || form.maxCompletion !== null || form.minThroughput !== null || form.maxLatency !== null || form.distillable || form.dataCollection !== '')
      React.useEffect(() => {
        let alive = true
        loadCatalog('orProviders').then(value => { if (alive) setProviders(value) }, () => { if (alive) setProviders({ providers: [], source: 'none' }) })
        return () => { alive = false }
      }, [])
      const names = React.useMemo(() => Object.fromEntries((providers?.providers ?? []).map(item => [item.slug, item.name])), [providers])
      const add = (key, value) => {
        const list = form[key] ?? []
        if (!list.includes(value)) set({ [key]: [...list, value] })
      }
      const defaultModel = rule.match.models.find(model => /^[\w.~-]+\/[\w.:~@+-]+$/.test(model)) ?? ''
      const toggle = (key, value) => set({ [key]: form[key].includes(value) ? form[key].filter(item => item !== value) : [...form[key], value] })
      return h('div', { className: 'rp-formgrid' },
        h('datalist', { id: 'rp-providers' }, (providers?.providers ?? []).map(item => h('option', { key: item.slug, value: item.slug }, item.name))),
        providers?.source === 'bundled' ? h('div', { className: 'rp-hint is-warn' }, t('route.bundled', { date: providers.asOf })) : null,
        rule.match.hosts.some(host => host.endsWith('openrouter.ai')) && !ui.endpoints.some(endpoint => endpoint.host.endsWith('openrouter.ai')) && !ui.channels.some(channel => channel.openrouter) ? h('div', { className: 'rp-hint' }, t('route.noTraffic')) : null,
        h(Field, { label: t('route.order'), hint: t('route.orderHint'), htmlFor: 'rp-order', wide: true },
          h(OrderList, { ui, id: 'rp-order', label: t('route.order'), value: form.order, onChange: order => set({ order }), placeholder: t('route.providerPlaceholder'), listId: 'rp-providers', names })),
        h(Field, { label: t('route.only'), hint: t('route.onlyHint'), htmlFor: 'rp-only', wide: true },
          h(ChipsInput, { ui, id: 'rp-only', label: t('route.only'), value: form.only, onChange: only => set({ only }), placeholder: t('route.providerPlaceholder'), listId: 'rp-providers', format: slug => (names[slug] === undefined ? slug : `${names[slug]} (${slug})`) })),
        h(Field, { label: t('route.ignore'), hint: t('route.ignoreHint'), htmlFor: 'rp-ignore', wide: true },
          h(ChipsInput, { ui, id: 'rp-ignore', label: t('route.ignore'), value: form.ignore, onChange: ignore => set({ ignore }), placeholder: t('route.providerPlaceholder'), listId: 'rp-providers', format: slug => (names[slug] === undefined ? slug : `${names[slug]} (${slug})`) })),
        h('div', { className: 'rp-field is-wide' }, h(ProviderExplorer, { ui, defaultModel, models, wantModels, onAdd: add })),
        h('div', { className: 'rp-field is-wide rp-checks' },
          h(Check, { checked: form.allowFallbacks, onChange: allowFallbacks => set({ allowFallbacks }), hint: t('route.fallbacksHint') }, t('route.fallbacks')),
          h(Check, { checked: form.requireParameters, onChange: requireParameters => set({ requireParameters }), hint: t('route.requireHint') }, t('route.require')),
          h(Check, { checked: form.zdr, onChange: zdr => set({ zdr }), hint: t('route.zdrHint') }, t('route.zdr'))),
        h(Field, { label: t('route.sort'), hint: t('route.sortHint'), wide: true },
          h(Seg, { value: form.sort, label: t('route.sort'), onChange: sort => set({ sort }), options: [{ value: '', label: t('route.sortDefault') }, { value: 'price', label: t('route.sortPrice') }, { value: 'throughput', label: t('route.sortThroughput') }, { value: 'latency', label: t('route.sortLatency') }] })),
        h(Field, { label: t('route.models'), hint: t('route.modelsHint'), htmlFor: 'rp-models-order', wide: true },
          h(OrderList, { ui, id: 'rp-models-order', label: t('route.models'), value: form.models, onChange: list => set({ models: list }), placeholder: 'anthropic/claude-sonnet-4.5', listId: 'rp-models' })),
        h('div', { className: 'rp-field is-wide' },
          h('button', { type: 'button', className: 'rp-link', 'aria-expanded': more, onClick: () => setMore(!more) }, more ? t('route.lessOptions') : t('route.moreOptions'))),
        more ? h(React.Fragment, null,
          h(Field, { label: t('route.data'), hint: t('route.dataHint'), wide: true },
            h(Seg, { value: form.dataCollection, label: t('route.data'), onChange: dataCollection => set({ dataCollection }), options: [{ value: '', label: t('route.dataDefault') }, { value: 'allow', label: t('route.dataAllow') }, { value: 'deny', label: t('route.dataDeny') }] })),
          h(Field, { label: t('route.quant'), hint: t('route.quantHint'), wide: true },
            h('div', { className: 'rp-toggles' }, QUANTIZATIONS.map(item => h('button', { key: item, type: 'button', className: 'rp-toggle', 'aria-pressed': form.quantizations.includes(item), onClick: () => toggle('quantizations', item) }, item)))),
          h(Field, { label: t('route.maxPrompt'), htmlFor: 'rp-max-prompt' }, h(NumberInput, { ui, id: 'rp-max-prompt', value: form.maxPrompt, onChange: maxPrompt => set({ maxPrompt }), unit: t('route.perMillion') })),
          h(Field, { label: t('route.maxCompletion'), htmlFor: 'rp-max-completion' }, h(NumberInput, { ui, id: 'rp-max-completion', value: form.maxCompletion, onChange: maxCompletion => set({ maxCompletion }), unit: t('route.perMillion') })),
          h(Field, { label: t('route.minThroughput'), hint: t('route.perfHint'), htmlFor: 'rp-min-throughput' }, h(NumberInput, { ui, id: 'rp-min-throughput', value: form.minThroughput, onChange: minThroughput => set({ minThroughput }), unit: 'tok/s' })),
          h(Field, { label: t('route.maxLatency'), hint: t('route.perfHint'), htmlFor: 'rp-max-latency' }, h(NumberInput, { ui, id: 'rp-max-latency', value: form.maxLatency, onChange: maxLatency => set({ maxLatency }), unit: t('route.seconds') })),
          h('div', { className: 'rp-field is-wide rp-checks' }, h(Check, { checked: form.distillable, onChange: distillable => set({ distillable }), hint: t('route.distillableHint') }, t('route.distillable')))) : null)
    }

    function ReasoningForm({ ui, form, set }) {
      const { t } = ui
      return h('div', { className: 'rp-formgrid' },
        h(Field, { label: t('reasoning.effort'), hint: t('reasoning.effortHint'), wide: true },
          h(Seg, { value: form.effort, label: t('reasoning.effort'), onChange: effort => set({ effort }), options: [{ value: '', label: t('notSet') }, ...EFFORTS.map(value => ({ value, label: value }))] })),
        h(Field, { label: t('reasoning.maxTokens'), hint: t('reasoning.maxTokensHint'), htmlFor: 'rp-reasoning-max' }, h(NumberInput, { ui, id: 'rp-reasoning-max', value: form.maxTokens, onChange: maxTokens => set({ maxTokens }), integer: true, unit: 'tokens' })),
        h('div', { className: 'rp-field is-wide rp-checks' }, h(Check, { checked: form.exclude, onChange: exclude => set({ exclude }), hint: t('reasoning.excludeHint') }, t('reasoning.exclude'))))
    }

    function SamplingForm({ ui, form, set }) {
      const { t } = ui
      const fields = [['topK', 'sampling.topK', true], ['minP', 'sampling.minP', false], ['topA', 'sampling.topA', false], ['repetitionPenalty', 'sampling.repetition', false]]
      return h('div', { className: 'rp-formgrid' },
        fields.map(([key, label, integer]) => h(Field, { key, label: t(label), hint: t(`${label}Hint`), htmlFor: `rp-${key}` }, h(NumberInput, { ui, id: `rp-${key}`, value: form[key], onChange: value => set({ [key]: value }), integer }))))
    }

    function SessionForm({ ui, form, set }) {
      const { t } = ui
      return h('div', { className: 'rp-formgrid' },
        h('div', { className: 'rp-field is-wide rp-checks' },
          h(Check, { checked: form.body, onChange: body => set({ body }), hint: t('session.bodyHint') }, t('session.body')),
          h(Check, { checked: form.header, onChange: header => set({ header }), hint: t('session.headerHint') }, t('session.header'))))
    }

    function AttributionForm({ ui, form, set }) {
      const { t } = ui
      return h('div', { className: 'rp-formgrid' },
        h(Field, { label: t('attr.title'), hint: t('attr.titleHint'), htmlFor: 'rp-attr-title' }, h('input', { id: 'rp-attr-title', className: 'rp-input', value: form.title, placeholder: 'My App', onChange: event => set({ title: event.target.value }) })),
        h(Field, { label: t('attr.referer'), hint: t('attr.refererHint'), htmlFor: 'rp-attr-referer' }, h('input', { id: 'rp-attr-referer', className: 'rp-input', value: form.referer, placeholder: 'https://example.com', onChange: event => set({ referer: event.target.value }) })))
    }

    function StripForm({ ui, form, set }) {
      const { t } = ui
      return h('div', { className: 'rp-formgrid' },
        h(Field, { label: t('strip.fields'), hint: t('strip.hint'), htmlFor: 'rp-strip', wide: true },
          h(ChipsInput, { ui, id: 'rp-strip', label: t('strip.fields'), value: form.fields, onChange: fields => set({ fields }), placeholder: 'store' })),
        h('div', { className: 'rp-field is-wide' },
          h('div', { className: 'rp-toggles' }, ['store', 'stream_options.include_usage', 'user', 'metadata'].map(item => h('button', { key: item, type: 'button', className: 'rp-toggle', 'aria-pressed': form.fields.includes(item), onClick: () => set({ fields: form.fields.includes(item) ? form.fields.filter(field => field !== item) : [...form.fields, item] }) }, item)))))
    }

    const FORMS = { 'openrouter-routing': RoutingForm, reasoning: ReasoningForm, sampling: SamplingForm, session: SessionForm, attribution: AttributionForm, strip: StripForm }

    const PRESET_ORDER = ['openrouter-routing', 'reasoning', 'sampling', 'session', 'attribution', 'strip', 'custom']
    /** Ready-made custom rules for other gateways; each field is one the gateway documents. */
    const RECIPES = {
      'vllm-thinking': { hosts: [], merge: { chat_template_kwargs: { enable_thinking: false } }, headers: {} },
      helicone: { hosts: ['*.helicone.ai'], merge: {}, headers: { 'Helicone-Auth': 'Bearer {{env:HELICONE_API_KEY}}', 'Helicone-Session-Id': '{{session}}', 'Helicone-Property-App': 'dsh' } },
      cloudflare: { hosts: ['gateway.ai.cloudflare.com'], merge: {}, headers: { 'cf-aig-cache-ttl': '3600', 'cf-aig-metadata': '{"session":"{{session}}"}' } },
      'openai-cache': { hosts: ['api.openai.com'], merge: { prompt_cache_key: '{{session}}' }, headers: {} },
    }
    const RECIPE_ORDER = Object.keys(RECIPES)

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
      return h('div', { className: 'rp-headers' },
        rows.map(([name, text], index) => h('div', { key: index, className: 'rp-headerrow' },
          h('input', { className: 'rp-input rp-mono', value: name, placeholder: 'X-Header', 'aria-label': t('headers.name'), autoComplete: 'off', spellCheck: false, onChange: event => push(rows.map((row, at) => (at === index ? [event.target.value, row[1]] : row))) }),
          h('input', { className: 'rp-input rp-mono', value: text, placeholder: t('headers.valuePlaceholder'), 'aria-label': t('headers.value'), autoComplete: 'off', spellCheck: false, onChange: event => push(rows.map((row, at) => (at === index ? [row[0], event.target.value] : row))) }),
          h('button', { type: 'button', className: 'rp-iconbtn', 'aria-label': t('headers.remove', { name: name || String(index + 1) }), onClick: () => push(rows.filter((_, at) => at !== index)) }, '×'))),
        h('div', null, h('button', { type: 'button', className: 'rp-btn', onClick: () => setRows([...rows, ['', '']]) }, t('headers.add'))))
    }

    function EnvStatus({ ui, env }) {
      const names = Object.keys(env)
      if (names.length === 0) return null
      return h('div', { className: 'rp-envs' }, names.map(name => h('span', { key: name, className: `rp-badge ${env[name] ? 'is-ok' : 'is-warn'}`, title: ui.t(env[name] ? 'env.set' : 'env.unset', { name }) }, `${env[name] ? '✓' : '!'} ${name}`)))
    }

    function RuleEditor({ ui, rule, problems, index, count, env }) {
      const { t } = ui
      const Form = rule.preset === undefined ? undefined : FORMS[rule.preset.id]
      const edit = change => ui.updateRule(rule.id, (current) => { change(current); return current })
      const hostSuggestions = [...new Set([...ui.channels.filter(channel => channel.host !== undefined).map(channel => channel.host), 'openrouter.ai', ...ui.endpoints.map(endpoint => endpoint.host)])]
      const ruleChannels = ui.channels.filter(channel => rule.match.hosts.includes(channel.host))
      const modelSuggestions = [...new Set([...(ruleChannels.length > 0 ? ruleChannels : ui.channels).flatMap(channel => channel.models.map(model => model.id)), ...ui.endpoints.flatMap(endpoint => endpoint.models)])]
      const usable = ui.channels.filter(channel => channel.host !== undefined)
      const addChannel = (id) => {
        const channel = usable.find(item => item.id === id)
        if (channel === undefined) return
        const wanted = matchOfChannel(channel)
        edit((r) => {
          for (const host of wanted.hosts) if (!r.match.hosts.includes(host)) r.match.hosts.push(host)
          for (const path of wanted.paths) if (!r.match.paths.includes(path)) r.match.paths.push(path)
        })
      }
      const idp = suffix => `rp-${rule.id}-${suffix}`
      const [confirmDelete, setConfirmDelete] = React.useState(false)
      return h('div', { className: 'rp-body' },
        h('datalist', { id: idp('hosts') }, hostSuggestions.map(host => h('option', { key: host, value: host }))),
        h('datalist', { id: idp('models') }, modelSuggestions.map(model => h('option', { key: model, value: model }))),
        problems.length === 0 ? null : h('div', { className: 'rp-note is-warn', role: 'alert' },
          h('ul', { className: 'rp-problems' }, problems.map((problem, at) => h('li', { key: at }, problemText(t, problem))))),
        h('div', { className: 'rp-formgrid' },
          h(Field, { label: t('rule.name'), htmlFor: idp('name'), wide: true },
            h('input', { id: idp('name'), className: 'rp-input', value: rule.name, maxLength: ui.limits.name, placeholder: t('rule.namePlaceholder'), onChange: event => edit((r) => { r.name = event.target.value }) }))),
        h('div', { className: 'rp-section' },
          h('div', { className: 'rp-sectiontitle' }, t('match.title')),
          h('div', { className: 'rp-formgrid' },
            h(Field, { label: t('match.hosts'), hint: t('match.hostsHint'), htmlFor: idp('hosts-input'), wide: true },
              h(ChipsInput, { ui, id: idp('hosts-input'), label: t('match.hosts'), value: rule.match.hosts, listId: idp('hosts'), placeholder: 'openrouter.ai', onChange: hosts => edit((r) => { r.match.hosts = hosts }) }),
              usable.length === 0 ? null : h('select', { className: 'rp-input rp-select', value: '', 'aria-label': t('match.fromChannel'), onChange: event => addChannel(event.target.value) },
                h('option', { value: '' }, t('match.fromChannel')),
                usable.map(channel => h('option', { key: channel.id, value: channel.id }, `${channel.name} · ${channel.host}${channel.sharedHost ? channel.basePath : ''}`)))),
            h(Field, { label: t('match.models'), hint: t('match.modelsHint'), htmlFor: idp('models-input'), wide: true },
              h(ChipsInput, { ui, id: idp('models-input'), label: t('match.models'), value: rule.match.models, listId: idp('models'), placeholder: 'deepseek/*', onChange: models => edit((r) => { r.match.models = models }) })),
            h(Field, { label: t('match.paths'), hint: t('match.pathsHint'), htmlFor: idp('paths-input'), wide: true },
              h(ChipsInput, { ui, id: idp('paths-input'), label: t('match.paths'), value: rule.match.paths, placeholder: '/api/v1/chat', onChange: paths => edit((r) => { r.match.paths = paths }) })))),
        h('div', { className: 'rp-section' },
          h('div', { className: 'rp-sectiontitle' }, rule.preset === undefined ? t('params.custom') : t(`preset.${rule.preset.id}.name`)),
          Form === undefined ? h(CustomParams, { ui, rule, edit, env, idp }) : h(React.Fragment, null,
            h(Form, { ui, rule, form: rule.preset.form, set: patch => ui.setForm(rule.id, patch) }),
            h(Generated, { ui, rule, edit }))),
        h('div', { className: 'rp-section' },
          h(Field, { label: t('rule.note'), htmlFor: idp('note'), wide: true },
            h('input', { id: idp('note'), className: 'rp-input', value: rule.note ?? '', maxLength: ui.limits.note, placeholder: t('rule.notePlaceholder'), onChange: event => edit((r) => { if (event.target.value === '') delete r.note; else r.note = event.target.value }) }))),
        confirmDelete ? h(ConfirmBox, { ui, text: t('rule.confirmDelete', { name: rule.name || t('rule.unnamed') }), action: t('rule.delete'), danger: true, onCancel: () => setConfirmDelete(false), onConfirm: () => ui.deleteRule(rule.id) }) : null,
        h('div', { className: 'rp-bar rp-actionsbar' },
          h('button', { type: 'button', className: 'rp-btn', onClick: () => ui.duplicateRule(rule.id) }, t('rule.duplicate')),
          h('button', { type: 'button', className: 'rp-btn', disabled: index === 0, onClick: () => ui.moveRule(rule.id, -1) }, t('rule.moveUp')),
          h('button', { type: 'button', className: 'rp-btn', disabled: index === count - 1, onClick: () => ui.moveRule(rule.id, 1) }, t('rule.moveDown')),
          h('span', { className: 'rp-grow' }),
          h('button', { type: 'button', className: 'rp-btn rp-danger', onClick: () => setConfirmDelete(true) }, t('rule.delete'))))
    }

    /** What a preset form currently builds, as the JSON that will be sent, with a way to edit it by hand instead. */
    function Generated({ ui, rule, edit }) {
      const { t } = ui
      const [open, setOpen] = React.useState(false)
      const [confirm, setConfirm] = React.useState(false)
      const view = {
        ...Object.keys(rule.body.merge).length === 0 ? {} : { body: rule.body.merge },
        ...rule.body.remove.length === 0 ? {} : { remove: rule.body.remove },
        ...Object.keys(rule.headers.set).length === 0 ? {} : { headers: rule.headers.set },
      }
      return h('div', { className: 'rp-section' },
        h('div', { className: 'rp-bar' },
          h('button', { type: 'button', className: 'rp-link', 'aria-expanded': open, onClick: () => setOpen(!open) }, open ? t('generated.hide') : t('generated.show')),
          h('span', { className: 'rp-grow' }),
          open ? h('button', { type: 'button', className: 'rp-link', onClick: () => setConfirm(true) }, t('generated.detach')) : null),
        open ? h('pre', { className: 'rp-pre' }, Object.keys(view).length === 0 ? t('generated.empty') : pretty(view)) : null,
        confirm ? h(ConfirmBox, { ui, text: t('generated.confirmDetach'), action: t('generated.detach'), onCancel: () => setConfirm(false), onConfirm: () => { setConfirm(false); edit((r) => { delete r.preset }) } }) : null)
    }

    function CustomParams({ ui, rule, edit, env, idp }) {
      const { t } = ui
      return h('div', { className: 'rp-formgrid' },
        h(Field, { label: t('custom.merge'), hint: t('custom.mergeHint'), htmlFor: idp('merge'), wide: true },
          h(JsonField, { ui, id: idp('merge'), value: rule.body.merge, rows: 7, onChange: merge => edit((r) => { r.body.merge = merge }) })),
        h(Field, { label: t('custom.defaults'), hint: t('custom.defaultsHint'), htmlFor: idp('defaults'), wide: true },
          h(JsonField, { ui, id: idp('defaults'), value: rule.body.defaults, rows: 4, onChange: defaults => edit((r) => { r.body.defaults = defaults }) })),
        h(Field, { label: t('custom.remove'), hint: t('custom.removeHint'), htmlFor: idp('remove'), wide: true },
          h(ChipsInput, { ui, id: idp('remove'), label: t('custom.remove'), value: rule.body.remove, placeholder: 'store', onChange: remove => edit((r) => { r.body.remove = remove }) })),
        h(Field, { label: t('custom.headers'), hint: t('custom.headersHint'), wide: true },
          h(HeadersTable, { ui, value: rule.headers.set, onChange: set => edit((r) => { r.headers.set = set }) })),
        h(Field, { label: t('custom.removeHeaders'), hint: t('custom.removeHeadersHint'), htmlFor: idp('remove-headers'), wide: true },
          h(ChipsInput, { ui, id: idp('remove-headers'), label: t('custom.removeHeaders'), value: rule.headers.remove, placeholder: 'x-unwanted', onChange: remove => edit((r) => { r.headers.remove = remove.map(name => name.toLowerCase()) }) })),
        h('div', { className: 'rp-field is-wide' },
          h('div', { className: 'rp-hint' }, t('custom.templates')),
          h(EnvStatus, { ui, env })),
        h('div', { className: 'rp-field is-wide rp-checks' },
          h(Check, { checked: rule.allowProtected, onChange: allowProtected => edit((r) => { r.allowProtected = allowProtected }), hint: t('custom.protectedHint', { fields: ui.limits.protectedBody.join(', ') }) }, t('custom.protected'))))
    }

    function summaryOf(t, rule) {
      const fields = Object.keys(rule.body.merge).length + Object.keys(rule.body.defaults).length
      const parts = []
      if (fields > 0) parts.push(pl(t, 'rule.fields', fields))
      if (rule.body.remove.length > 0) parts.push(t('rule.removes', { n: rule.body.remove.length }))
      const headers = Object.keys(rule.headers.set).length + rule.headers.remove.length
      if (headers > 0) parts.push(pl(t, 'rule.headers', headers))
      return parts.length === 0 ? t('rule.empty') : parts.join(' · ')
    }

    /** What a rule needs to reach one channel: its host, its base path when another channel shares the host, and its models when one shares the base URL. */
    function matchOfChannel(channel) {
      // Two channels with the same base URL differ only in their models.
      const models = channel.sameEndpoint && channel.models.length > 0 && channel.models.length <= 50 ? channel.models.map(model => model.id) : []
      return { hosts: [channel.host], paths: channel.sharedHost && channel.basePath !== '' ? [channel.basePath] : [], models }
    }

    /** The configured channel a rule is written for, when its one host (and path, if needed) names exactly one. */
    function channelOfRule(channels, rule) {
      if (rule.match.hosts.length !== 1) return undefined
      return channels.find(channel => channel.host === rule.match.hosts[0] && (!channel.sharedHost || rule.match.paths.includes(channel.basePath)))
    }

    /** How many rules reach a channel's host (and, for a shared host, its path or every path). */
    function rulesOfChannel(rules, channel) {
      return rules.filter(rule => rule.match.hosts.includes(channel.host) && (!channel.sharedHost || rule.match.paths.length === 0 || rule.match.paths.some(path => channel.basePath.startsWith(path)))).length
    }

    /** The channels dsh has configured, each with a way to start a rule for it. */
    function ChannelsSection({ ui, state, rules, open, onToggle, onMake, onRouting }) {
      const { t } = ui
      const channels = state?.channels ?? []
      let content
      if (state === null) content = h('div', { className: 'rp-hint', role: 'status' }, t('channels.loading'))
      else if (state.error !== undefined) content = h('div', { className: 'rp-hint is-warn' }, t('channels.failed', { reason: state.error }))
      else if (!state.available) content = h('div', { className: 'rp-hint' }, t('channels.unavailable'))
      else if (channels.length === 0) content = h('div', { className: 'rp-hint' }, t('channels.none'))
      else {
        content = h('div', { className: 'rp-channels' }, channels.map((channel) => {
          const count = rulesOfChannel(rules, channel)
          return h('div', { key: channel.id, className: 'rp-channel' },
            h('div', { className: 'rp-channelmain' },
              h('div', { className: 'rp-channeltitle' },
                h('span', { className: 'rp-channelname' }, channel.name),
                channel.name === channel.id ? null : h('code', { className: 'rp-dim' }, channel.id)),
              channel.host === undefined ? h('div', { className: 'rp-hint is-warn' }, t('channels.noHost')) : h('div', { className: 'rp-channelmeta' },
                h('code', { className: 'rp-channelurl' }, `${channel.host}${channel.basePath}`),
                h('span', { className: `rp-badge${channel.seen ? ' is-ok' : ''}`, title: t(`channels.source.${channel.source}`) }, channel.seen ? t('channels.seen') : t(`channels.source.${channel.source}`)),
                channel.modelCount === 0 ? null : h('span', { className: 'rp-badge', title: channel.models.slice(0, 15).map(model => model.id).join('\n') }, pl(t, 'channels.models', channel.modelCount)),
                count === 0 ? null : h('span', { className: 'rp-badge is-accent' }, pl(t, 'channels.rules', count))),
              channel.modelsError === undefined ? null : h('div', { className: 'rp-hint' }, t('channels.modelsError', { reason: channel.modelsError }))),
            h('div', { className: 'rp-rowbtns' },
              channel.openrouter ? h('button', { type: 'button', className: `rp-btn is-small${count === 0 ? ' rp-primary' : ''}`, onClick: () => onRouting(channel) }, t('channels.routing')) : null,
              h('button', { type: 'button', className: `rp-btn is-small${count === 0 && !channel.openrouter ? ' rp-primary' : ''}`, disabled: channel.host === undefined, onClick: () => onMake(channel) }, t(channel.openrouter ? 'channels.more' : 'channels.make'))))
        }))
      }
      return h('div', { className: 'rp-section rp-channelsbox' },
        h('div', { className: 'rp-bar' },
          h('button', { type: 'button', className: 'rp-grouphead', 'aria-expanded': open, onClick: onToggle },
            h('span', { className: 'rp-caret', 'aria-hidden': true }, '›'),
            h('span', { className: 'rp-sectiontitle' }, state?.available && channels.length > 0 ? t('channels.titleCount', { n: channels.length }) : t('channels.title'))),
          open ? h('span', { className: 'rp-hint rp-grow' }, t('channels.hint')) : null),
        open ? content : null)
    }

    function RuleRow({ ui, rule, index, count, open, problems, hit, env }) {
      const { t } = ui
      const channel = channelOfRule(ui.channels, rule)
      const hostText = rule.match.hosts.length === 0 ? t('rule.noHost') : channel !== undefined ? channel.name : rule.match.hosts.length === 1 ? rule.match.hosts[0] : `${rule.match.hosts[0]} +${rule.match.hosts.length - 1}`
      const blocking = rule.enabled && problems.length > 0
      return h('div', { className: `rp-row${open ? ' is-open' : ''}${rule.enabled ? '' : ' is-off'}`, id: `rp-row-${rule.id}` },
        h('div', { className: 'rp-top' },
          h('div', { className: 'rp-switchcell' }, h(Switch, { checked: rule.enabled, label: t(rule.enabled ? 'rule.disable' : 'rule.enable', { name: rule.name || t('rule.unnamed') }), onChange: enabled => ui.updateRule(rule.id, (r) => { r.enabled = enabled; return r }) })),
          h('button', { type: 'button', className: 'rp-head', 'aria-expanded': open, onClick: () => ui.toggleOpen(rule.id) },
            h('span', { className: `rp-name${rule.name === '' ? ' is-dim' : ''}` }, rule.name || t('rule.unnamed')),
            h('span', { className: 'rp-meta rp-narrow-hide' }, `${hostText} · ${summaryOf(t, rule)}`),
            rule.match.models.length === 0 ? null : h('span', { className: 'rp-chip is-plain rp-narrow-hide' }, rule.match.models.length === 1 ? rule.match.models[0] : `${rule.match.models[0]} +${rule.match.models.length - 1}`),
            blocking ? h('span', { className: 'rp-badge is-error' }, pl(t, 'rule.problems', problems.length)) : null,
            hit === undefined || hit.changed === 0 || !rule.enabled ? null : h('span', { className: 'rp-badge is-accent', title: t('rule.hitsTitle') }, t('rule.hits', { n: hit.changed })),
            h('span', { className: 'rp-caret', 'aria-hidden': true }, '›'))),
        open ? h(RuleEditor, { ui, rule, problems, index, count, env }) : null)
    }

    /** The ways to start a rule, as cards. */
    function Gallery({ ui, onPick, onClose, inline, target }) {
      const { t } = ui
      const ref = usePanelFocus()
      const featured = target === undefined || target.openrouter
      return h('div', { className: inline ? 'rp-gallery-inline' : 'rp-panel', ref, tabIndex: -1, onKeyDown: inline ? undefined : onEscape(onClose), role: inline ? undefined : 'group', 'aria-label': t('gallery.title') },
        inline ? null : h('div', { className: 'rp-bar' }, h('strong', { className: 'rp-grow' }, t('gallery.title')), h('button', { type: 'button', className: 'rp-btn is-ghost', onClick: onClose }, t('close'))),
        target === undefined ? null : h('div', { className: 'rp-note' }, t('gallery.forChannel', { name: target.name, where: `${target.host}${target.sharedHost ? target.basePath : ''}` })),
        h('div', { className: 'rp-cards' }, PRESET_ORDER.map(id => h('button', { key: id, type: 'button', className: `rp-card${id === 'openrouter-routing' && featured ? ' is-featured' : ''}`, onClick: () => onPick(id) },
          h('span', { className: 'rp-cardtitle' }, t(`preset.${id}.name`), id === 'openrouter-routing' && featured ? h('span', { className: 'rp-badge is-accent' }, t('gallery.popular')) : null),
          h('span', { className: 'rp-carddesc' }, t(`preset.${id}.desc`)),
          h('code', { className: 'rp-cardcode' }, t(`preset.${id}.example`))))),
        h('div', { className: 'rp-label' }, t('gallery.recipes')),
        h('div', { className: 'rp-cards' }, RECIPE_ORDER.map(id => h('button', { key: id, type: 'button', className: 'rp-card', onClick: () => onPick(`recipe:${id}`) },
          h('span', { className: 'rp-cardtitle' }, t(`recipe.${id}.name`)),
          h('span', { className: 'rp-carddesc' }, t(`recipe.${id}.desc`)),
          h('code', { className: 'rp-cardcode' }, t(`recipe.${id}.example`))))))
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

    const SIGNS = { set: '+', default: '+', remove: '−', header: 'H', 'header-remove': 'H−' }

    function ChangeList({ ui, changes, more }) {
      const { t } = ui
      if (changes.length === 0) return null
      return h('ul', { className: 'rp-changes' },
        changes.map((change, index) => h('li', { key: index, className: `rp-change is-${change.kind}` },
          h('span', { className: 'rp-sign', 'aria-label': t(`change.${change.kind}`) , title: t(`change.${change.kind}`) }, SIGNS[change.kind]),
          h('code', { className: 'rp-changepath' }, change.path),
          change.secret ? h('span', { className: 'rp-dim' }, t('change.secret')) : change.value === undefined ? null : h('code', { className: 'rp-changevalue' }, change.value))),
        more > 0 ? h('li', { className: 'rp-dim' }, t('change.more', { n: more })) : null)
    }

    function Notes({ ui, skipped, invalid, rules }) {
      const { t } = ui
      const nameOf = id => rules.find(rule => rule.id === id)?.name || t('rule.unnamed')
      return h(React.Fragment, null,
        (skipped ?? []).map((item, index) => h('div', { key: `s${index}`, className: 'rp-note is-warn' }, t(`skipped.${item.reason}`, { name: item.detail, field: item.path, rule: nameOf(item.rule) }))),
        (invalid ?? []).map((item, index) => h('div', { key: `i${index}`, className: 'rp-note is-warn' }, t('invalid.rule', { rule: item.name || t('rule.unnamed'), problems: item.codes.map(code => t(`problem.${code}`, { detail: '' }).replace(/[：:]\s*$/, '')).join(t('listSeparator')) }))))
    }

    /** Fields a rule set that the gateway's error text names as whole words. */
    function mentionedFields(entry) {
      if (entry.errorText === undefined || entry.errorText === '') return []
      const names = new Set(entry.changes.filter(change => change.kind !== 'remove' && change.kind !== 'header-remove').map(change => change.path.split('.')[0]).filter(name => name.length >= 3))
      return [...names].filter(name => new RegExp(`(?<![A-Za-z0-9_-])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_-])`, 'i').test(entry.errorText))
    }

    function RequestsTab({ ui, recent, endpoints, rules, enabled, onClear, onPause }) {
      const { t, lang } = ui
      const [open, setOpen] = React.useState(() => new Set())
      const toggle = id => setOpen((current) => {
        const next = new Set(current)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
      const now = Date.now()
      return h('div', { className: 'rp-section' },
        h('div', { className: 'rp-bar' },
          h('div', { className: 'rp-hint rp-grow' }, t('req.intro')),
          h('button', { type: 'button', className: 'rp-btn', disabled: recent.length === 0, onClick: onClear }, t('req.clear'))),
        endpoints.length === 0 ? null : h('div', { className: 'rp-section' },
          h('div', { className: 'rp-label' }, t('req.endpoints')),
          h('div', { className: 'rp-endpoints' }, endpoints.map(endpoint => h('div', { key: `${endpoint.host}${endpoint.path}`, className: 'rp-endpoint' },
            h('div', { className: 'rp-endpointmain' },
              h('code', { className: 'rp-endpointurl' }, `${endpoint.host}${endpoint.path}`),
              h('span', { className: 'rp-hint' }, `${pl(t, 'req.count', endpoint.count)}${endpoint.models.length === 0 ? '' : ` · ${endpoint.models.join(', ')}`}`)),
            h('button', { type: 'button', className: 'rp-btn is-small', onClick: () => ui.ruleForEndpoint(endpoint) }, t('req.makeRule')))))),
        recent.length === 0 ? h('div', { className: 'rp-empty' }, h('div', { className: 'rp-emptytitle' }, t('req.emptyTitle')), h('div', { className: 'rp-hint' }, t('req.emptyHint'))) : h('div', { className: 'rp-list' }, recent.map((entry) => {
          const failed = entry.networkError !== undefined || (entry.status !== undefined && entry.status >= 400)
          const applied = entry.changes.length + (entry.moreChanges ?? 0)
          const isOpen = open.has(entry.id)
          let tag
          if (entry.failed !== undefined) tag = h('span', { className: 'rp-badge is-warn' }, t('req.notApplied'))
          else if (entry.paused) tag = h('span', { className: 'rp-badge' }, t('req.paused'))
          else if (entry.changed) tag = h('span', { className: 'rp-badge is-accent' }, t('req.applied', { n: applied }))
          else if (entry.matched.length > 0) tag = h('span', { className: 'rp-badge' }, t('req.noChange'))
          else tag = h('span', { className: 'rp-badge' }, t('req.noMatch'))
          const status = entry.aborted === true ? t('req.aborted') : entry.networkError !== undefined ? t('req.networkError') : entry.status === undefined ? '…' : String(entry.status)
          return h('div', { key: entry.id, className: `rp-row${isOpen ? ' is-open' : ''}` },
            h('button', { type: 'button', className: 'rp-head rp-requesthead', 'aria-expanded': isOpen, onClick: () => toggle(entry.id) },
              h('span', { className: `rp-badge ${failed ? 'is-error' : entry.status === undefined ? '' : 'is-ok'}` }, status),
              h('span', { className: 'rp-name' }, entry.model ?? t('req.noModel')),
              h('span', { className: 'rp-meta rp-narrow-hide' }, `${entry.host}${entry.path}`),
              tag,
              h('span', { className: 'rp-meta', title: clock(lang, entry.at) }, ago(lang, entry.at, now)),
              h('span', { className: 'rp-caret', 'aria-hidden': true }, '›')),
            isOpen ? h('div', { className: 'rp-body' },
              h('div', { className: 'rp-hint' }, `${entry.method} ${entry.host}${entry.path} · ${clock(lang, entry.at)}${entry.durationMs === undefined ? '' : ` · ${t('req.duration', { ms: entry.durationMs })}`}`),
              entry.matched.length === 0 ? null : h('div', { className: 'rp-hint' }, `${t('req.matched')}: ${entry.matched.map(match => match.name || t('rule.unnamed')).join(', ')}`),
              entry.failed === undefined ? null : h('div', { className: 'rp-note is-warn', role: 'alert' }, t('req.failed', { reason: entry.failed })),
              h(ChangeList, { ui, changes: entry.changes, more: entry.moreChanges ?? 0 }),
              h(Notes, { ui, skipped: entry.skipped, invalid: entry.invalid, rules }),
              entry.networkError === undefined ? null : h('div', { className: 'rp-note is-warn', role: 'alert' }, t('req.networkDetail', { reason: entry.networkError })),
              entry.errorText === undefined || entry.errorText === '' ? null : h('div', { className: 'rp-section' }, h('div', { className: 'rp-label' }, t('req.errorText')), h('pre', { className: 'rp-pre' }, entry.errorText)),
              mentionedFields(entry).length === 0 ? null : h('div', { className: 'rp-note is-warn', role: 'status' }, t('req.mentions', { fields: mentionedFields(entry).join(', ') })),
              failed && entry.changed ? h('div', { className: 'rp-note' },
                h('span', { className: 'rp-grow' }, t('req.rejectedHint')),
                enabled ? h('button', { type: 'button', className: 'rp-btn', onClick: onPause }, t('req.pauseAll')) : null) : null) : null)
        })))
    }

    function DiffView({ ui, before, after }) {
      const { t } = ui
      const diff = lineDiff(pretty(before), pretty(after))
      if (diff === undefined) return h('pre', { className: 'rp-pre' }, pretty(after))
      return h('pre', { className: 'rp-pre rp-diff', 'aria-label': t('try.resultBody') },
        diff.map((line, index) => h('div', { key: index, className: `rp-diffline is-${line.type}` }, h('span', { className: 'rp-diffsign', 'aria-hidden': true }, line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' '), line.text)))
    }

    function TryTab({ ui, dirty, rules, defaultUrl, defaultModel }) {
      const { t } = ui
      const [saved] = React.useState(() => readStored('sessionStorage', TRY_KEY, {}))
      const [url, setUrl] = React.useState(() => (typeof saved.url === 'string' ? saved.url : defaultUrl ?? SAMPLE_URL))
      const [text, setText] = React.useState(() => (typeof saved.text === 'string' ? saved.text : pretty(defaultModel === undefined ? SAMPLE_BODY : { ...SAMPLE_BODY, model: defaultModel })))
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
      return h('div', { className: 'rp-section' },
        h('div', { className: 'rp-hint' }, t('try.intro')),
        h('div', { className: 'rp-formgrid' },
          h(Field, { label: t('try.url'), htmlFor: 'rp-try-url', wide: true }, h('input', { id: 'rp-try-url', className: 'rp-input rp-mono', value: url, spellCheck: false, onChange: event => setUrl(event.target.value) })),
          h(Field, { label: t('try.body'), hint: t('try.bodyHint'), htmlFor: 'rp-try-body', wide: true }, h('textarea', { id: 'rp-try-body', className: 'rp-input rp-textarea', rows: 9, value: text, spellCheck: false, onChange: event => setText(event.target.value) })),
          h(Field, { label: t('try.session'), hint: t('try.sessionHint'), htmlFor: 'rp-try-session' }, h('input', { id: 'rp-try-session', className: 'rp-input', value: session, placeholder: 'SESSION-ID', onChange: event => setSession(event.target.value) }))),
        h('div', { className: 'rp-bar' },
          h('button', { type: 'button', className: 'rp-btn rp-primary', disabled: state.kind === 'loading' || url.trim() === '', onClick: run }, t('try.run')),
          h('button', { type: 'button', className: 'rp-btn', onClick: () => { setUrl(defaultUrl ?? SAMPLE_URL); setText(pretty(defaultModel === undefined ? SAMPLE_BODY : { ...SAMPLE_BODY, model: defaultModel })); setState({ kind: 'idle' }) } }, t('try.reset')),
          dirty ? h(Check, { checked: useDraft, onChange: setUseDraft }, t('try.useDraft')) : null),
        state.kind === 'bad' ? h('div', { className: 'rp-note is-warn', role: 'alert' }, t('jsonInvalid', { reason: state.reason })) : null,
        state.kind === 'error' ? h('div', { className: 'rp-note is-warn', role: 'alert' }, ui.describe(state.error)) : null,
        result === undefined ? null : h('div', { className: 'rp-section', role: 'status', ref: resultRef },
          result.paused ? h('div', { className: 'rp-note' }, t('try.paused')) : null,
          !result.modelEndpoint && result.matched.length === 0 && rules.length > 0 ? h('div', { className: 'rp-note' }, t('try.notModelEndpoint')) : null,
          result.matched.length === 0 && !result.paused ? h('div', { className: 'rp-note' }, t('try.noMatch')) : h('div', { className: 'rp-hint' }, `${t('req.matched')}: ${result.matched.map(match => match.name || t('rule.unnamed')).join(', ')}`),
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
        h('div', { className: 'rp-bar' }, h('strong', { className: 'rp-grow' }, t('import.title')), h('button', { type: 'button', className: 'rp-btn is-ghost', onClick: onClose }, t('close'))),
        h('div', { className: 'rp-hint' }, t('import.hint')),
        h('textarea', { className: 'rp-input rp-textarea', rows: 7, value: text, placeholder: '{ "rules": [ … ] }', 'aria-label': t('import.title'), spellCheck: false, onChange: (event) => { setText(event.target.value); setState({ kind: 'idle' }) } }),
        h('div', { className: 'rp-bar' },
          h('button', { type: 'button', className: 'rp-btn rp-primary', disabled: text.trim() === '' || state.kind === 'loading', onClick: () => read(text) }, t('import.read')),
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
          h('ul', { className: 'rp-problems' }, state.checked.config.rules.map(rule => h('li', { key: rule.id }, `${rule.name || t('rule.unnamed')} — ${rule.match.hosts.join(', ') || t('rule.noHost')}`))),
          state.checked.problems.length === 0 ? null : h('div', { className: 'rp-hint is-warn' }, pl(t, 'import.problems', new Set(state.checked.problems.map(problem => problem.ruleId)).size)),
          h('div', { className: 'rp-hint' }, t('import.unsaved')),
          confirm ? h(ConfirmBox, { ui, text: t('import.confirmReplace'), action: t('import.replace'), danger: true, onCancel: () => setConfirm(false), onConfirm: () => onApply(state.checked.config, 'replace') }) : h('div', { className: 'rp-bar' },
            h('button', { type: 'button', className: 'rp-btn rp-primary', onClick: () => onApply(state.checked.config, 'append') }, t('import.append')),
            hasRules ? h('button', { type: 'button', className: 'rp-btn', onClick: () => setConfirm(true) }, t('import.replace')) : null)) : null)
    }

    function HelpPanel({ ui, onClose }) {
      const { t } = ui
      const ref = usePanelFocus()
      return h('div', { className: 'rp-panel', ref, tabIndex: -1, role: 'group', 'aria-label': t('help.title'), onKeyDown: onEscape(onClose) },
        h('div', { className: 'rp-bar' }, h('strong', { className: 'rp-grow' }, t('help.title')), h('button', { type: 'button', className: 'rp-btn is-ghost', onClick: onClose }, t('close'))),
        ['help.what', 'help.how', 'help.templates', 'help.safety', 'help.privacy'].map(key => h('p', { key, className: 'rp-helpp' }, t(key))))
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
      const [tab, setTab] = React.useState(() => (['rules', 'requests', 'try'].includes(view.tab) ? view.tab : 'rules'))
      const [openId, setOpenId] = React.useState(() => (typeof view.open === 'string' ? view.open : null))
      const [panel, setPanelState] = React.useState(null)
      const [notice, setNotice] = React.useState(null)
      const [saving, setSaving] = React.useState(false)
      const [conflict, setConflict] = React.useState(false)
      const [checked, setChecked] = React.useState({ problems: [], env: {} })
      const [building, setBuilding] = React.useState(() => new Set())
      const [recent, setRecent] = React.useState({ recent: [], endpoints: [] })
      const [confirm, setConfirm] = React.useState(null)
      const [channels, setChannels] = React.useState(null)
      const [channelsOpen, setChannelsOpen] = React.useState(() => (typeof view.channels === 'boolean' ? view.channels : null))
      const [galleryTarget, setGalleryTarget] = React.useState(undefined)
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
      /** Open, switch, or close the panel below the toolbar, remembering what had focus so closing can give it back. */
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
      React.useEffect(() => { writeStored('sessionStorage', VIEW_KEY, { tab, open: openId, ...channelsOpen === null ? {} : { channels: channelsOpen } }) }, [tab, openId, channelsOpen])
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

      const problemsBy = React.useMemo(() => {
        const map = new Map()
        for (const problem of checked.problems) map.set(problem.ruleId, [...map.get(problem.ruleId) ?? [], problem])
        return map
      }, [checked])
      const hits = React.useMemo(() => {
        const map = new Map()
        for (const entry of recent.recent) {
          for (const match of entry.matched) {
            const hit = map.get(match.id) ?? { changed: 0 }
            if (entry.changed) hit.changed += 1
            map.set(match.id, hit)
          }
        }
        return map
      }, [recent])

      const updateRule = (id, change) => setDraft(current => ({ ...current, rules: current.rules.map(rule => (rule.id === id ? change(clone(rule)) : rule)) }))
      const doneBuilding = id => setBuilding((current) => {
        const next = new Set(current)
        next.delete(id)
        return next
      })
      const setForm = (id, patch) => {
        updateRule(id, (rule) => {
          if (rule.preset !== undefined) rule.preset.form = { ...rule.preset.form, ...patch }
          return rule
        })
        setBuilding(current => new Set(current).add(id))
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
            updateRule(id, (current) => {
              current.body.merge = built.body.merge ?? {}
              current.body.remove = built.body.remove ?? []
              current.headers.set = built.headers.set ?? {}
              return current
            })
            doneBuilding(id)
          } catch (error) {
            doneBuilding(id)
            if (alive.current) show({ kind: 'warn', text: describe(error) })
          }
        }, 200))
      }

      const reveal = (id) => {
        setOpenId(id)
        setTab('rules')
        setPanel(null)
        setGalleryTarget(undefined)
        setTimeout(() => document.getElementById(`rp-row-${id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 60)
      }
      const addRule = (rule) => {
        if (draftRef.current.rules.length >= server.limits.rules) { show({ kind: 'warn', text: t('limit.rules', { n: server.limits.rules }) }); return }
        setDraft(current => ({ ...current, rules: [...current.rules, rule] }))
        reveal(rule.id)
      }
      /** Start a rule from a preset, a recipe, or a blank one; with a channel, the rule is for that channel. */
      const addFromPreset = async (id, channel = galleryTarget) => {
        // `null` asks for no channel even while a channel's gallery is open.
        const target = channel ?? undefined
        const named = name => (target === undefined ? name : `${name} · ${target.name}`)
        if (id === 'custom') { addRule(blankRule({ name: named(t('preset.custom.name')), ...target === undefined ? {} : { match: matchOfChannel(target) } })); return }
        if (id.startsWith('recipe:')) {
          const recipeId = id.slice('recipe:'.length)
          const recipe = RECIPES[recipeId]
          addRule(blankRule({ name: named(t(`recipe.${recipeId}.name`)), match: target === undefined ? { hosts: [...recipe.hosts], paths: [], models: [] } : matchOfChannel(target), body: { merge: clone(recipe.merge), defaults: {}, remove: [] }, headers: { set: { ...recipe.headers }, remove: [] } }))
          return
        }
        const entry = server.presets[id]
        try {
          const built = await post('preset', { id, form: entry.form })
          addRule(blankRule({
            name: named(t(`preset.${id}.name`)),
            match: target === undefined ? { hosts: entry.hosts, paths: [], models: [] } : matchOfChannel(target),
            body: { merge: built.body.merge ?? {}, defaults: {}, remove: built.body.remove ?? [] },
            headers: { set: built.headers.set ?? {}, remove: [] },
            preset: { id, form: built.form },
          }))
        } catch (error) {
          show({ kind: 'warn', text: describe(error) })
        }
      }
      const openGallery = (target) => {
        setGalleryTarget(target)
        setTab('rules')
        setPanel('gallery')
      }
      const ruleForEndpoint = (endpoint) => {
        addRule(blankRule({ name: endpoint.host, match: { hosts: [endpoint.host], paths: [], models: endpoint.models.length === 1 ? endpoint.models : [] } }))
      }
      const duplicateRule = (id) => {
        const source = draftRef.current.rules.find(rule => rule.id === id)
        if (source === undefined) return
        const copy = { ...clone(source), id: newId(), name: t('rule.copyName', { name: source.name || t('rule.unnamed') }) }
        setDraft(current => {
          const at = current.rules.findIndex(rule => rule.id === id)
          return { ...current, rules: [...current.rules.slice(0, at + 1), copy, ...current.rules.slice(at + 1)] }
        })
        reveal(copy.id)
      }
      const moveRule = (id, delta) => setDraft((current) => {
        const at = current.rules.findIndex(rule => rule.id === id)
        const to = at + delta
        if (at < 0 || to < 0 || to >= current.rules.length) return current
        const rules = [...current.rules]
        const [rule] = rules.splice(at, 1)
        rules.splice(to, 0, rule)
        return { ...current, rules }
      })
      const deleteRule = (id) => {
        const at = draftRef.current.rules.findIndex(rule => rule.id === id)
        const rule = draftRef.current.rules[at]
        if (rule === undefined) return
        setDraft(current => ({ ...current, rules: current.rules.filter(item => item.id !== id) }))
        if (openId === id) setOpenId(null)
        undoRef.current = { rule, at }
        show({
          kind: 'done',
          text: t('rule.deleted', { name: rule.name || t('rule.unnamed') }),
          action: { label: t('undo'), run: () => {
            const kept = undoRef.current
            if (kept === null) return
            undoRef.current = null
            setDraft(current => ({ ...current, rules: [...current.rules.slice(0, kept.at), kept.rule, ...current.rules.slice(kept.at)] }))
            reveal(kept.rule.id)
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
          setDraft(current => ({ ...current, enabled }))
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
      const dryRun = ({ url, body, session, useDraft }) => post('dryRun', { url, body, session, ...useDraft ? { config: draftRef.current } : {} })

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
        setDraft((current) => {
          const taken = new Set(mode === 'replace' ? [] : current.rules.map(rule => rule.id))
          const incoming = config.rules.map((rule) => {
            const id = taken.has(rule.id) ? newId() : rule.id
            taken.add(id)
            return { ...rule, id }
          })
          return { ...current, rules: mode === 'replace' ? incoming : [...current.rules, ...incoming].slice(0, server.limits.rules) }
        })
        setPanel(null)
        setTab('rules')
        show({ kind: 'done', text: t('import.applied') })
      }

      const ui = {
        t, lang, zh, describe,
        limits: server?.limits,
        endpoints: recent.endpoints,
        channels: channels?.channels ?? [],
        updateRule, setForm, deleteRule, duplicateRule, moveRule, ruleForEndpoint, dryRun,
        toggleOpen: id => setOpenId(current => (current === id ? null : id)),
      }

      let body
      if (server === null || draft === null) {
        body = failure === null ? h('div', { className: 'rp-skeleton', 'aria-busy': true }, h('span'), h('span'), h('span')) : h('div', { className: 'rp-note is-warn', role: 'alert' }, h('span', { className: 'rp-grow' }, t('loadFailed', { reason: failure })), h('button', { type: 'button', className: 'rp-btn', onClick: () => load(false) }, t('retry')))
      } else {
        const rules = draft.rules
        const savedActive = server.rules.filter(rule => rule.enabled && (server.problems ?? []).every(problem => problem.ruleId !== rule.id)).length
        const last = recent.recent[0]
        let statusText
        if (!server.enabled) statusText = t('status.paused')
        else if (savedActive === 0) statusText = t('status.noRules')
        else statusText = pl(t, 'status.active', savedActive)
        if (last !== undefined) statusText += ` · ${t('status.last', { ago: ago(lang, last.at), result: last.changed ? pl(t, 'status.lastApplied', last.changes.length + (last.moreChanges ?? 0)) : last.paused ? t('status.lastPaused') : t('status.lastPlain') })}`
        body = h(React.Fragment, null,
          server.damaged === undefined ? null : h('div', { className: 'rp-note is-warn', role: 'alert' },
            h('div', { className: 'rp-grow' }, h('div', null, t('damaged.title')), h('div', { className: 'rp-hint' }, t('damaged.detail', { path: server.damaged.path, reason: server.damaged.message }))),
            confirm === 'reset' ? null : h('button', { type: 'button', className: 'rp-btn', onClick: () => setConfirm('reset') }, t('damaged.reset'))),
          confirm === 'reset' ? h(ConfirmBox, { ui, text: t('damaged.confirm'), action: t('damaged.reset'), onCancel: () => setConfirm(null), onConfirm: resetDamaged }) : null,
          conflict ? h('div', { className: 'rp-note is-warn', role: 'alert' },
            h('span', { className: 'rp-grow' }, t('conflict.text')),
            h('button', { type: 'button', className: 'rp-btn', onClick: loadLatest }, t('conflict.reload')),
            h('button', { type: 'button', className: 'rp-btn', onClick: () => save(true) }, t('conflict.overwrite'))) : null,
          h('div', { className: `rp-note rp-status${server.enabled ? '' : ' is-warn'}`, role: 'status' },
            h('span', { className: `rp-dot${server.enabled && savedActive > 0 ? ' is-on' : ''}`, 'aria-hidden': true }),
            h('span', { className: 'rp-grow' }, statusText)),
          h('div', { className: 'rp-toolbar' },
            h(Seg, { value: tab, label: t('tabs.label'), onChange: setTab, options: [
              { value: 'rules', label: `${t('tabs.rules')}${rules.length === 0 ? '' : ` · ${rules.length}`}` },
              { value: 'requests', label: t('tabs.requests') },
              { value: 'try', label: t('tabs.try') },
            ] }),
            h('span', { className: 'rp-grow' }),
            h('div', { className: 'rp-tools' },
              h('button', { type: 'button', className: 'rp-btn is-ghost', 'aria-expanded': panel === 'import', onClick: () => setPanel(panel === 'import' ? null : 'import') }, t('import.button')),
              h('button', { type: 'button', className: 'rp-btn is-ghost', disabled: rules.length === 0, onClick: exportRules }, t('export.button')),
              h('button', { type: 'button', className: 'rp-btn is-ghost', 'aria-expanded': panel === 'help', onClick: () => setPanel(panel === 'help' ? null : 'help') }, t('help.button')),
              h('button', { type: 'button', className: 'rp-btn is-ghost', disabled: loading, onClick: () => { void load(true); void loadChannels() } }, t('refresh')))),
          panel === 'help' ? h(HelpPanel, { ui, onClose: () => setPanel(null) }) : null,
          panel === 'import' ? h(ImportPanel, { ui, hasRules: rules.length > 0, onApply: applyImport, onClose: () => setPanel(null) }) : null,
          panel === 'gallery' ? h(Gallery, { ui, target: galleryTarget, onPick: id => addFromPreset(id), onClose: () => { setPanel(null); setGalleryTarget(undefined) } }) : null,
          tab === 'rules' ? h(ChannelsSection, {
            ui, state: channels, rules, open: channelsOpen ?? rules.length === 0, onToggle: () => setChannelsOpen(!(channelsOpen ?? rules.length === 0)),
            onMake: openGallery, onRouting: channel => addFromPreset('openrouter-routing', channel),
          }) : null,
          tab === 'rules' ? (rules.length === 0 ? h('div', { className: 'rp-onboarding' },
            h('div', { className: 'rp-emptytitle' }, t('empty.title')),
            h('div', { className: 'rp-hint' }, t('empty.body')),
            panel === 'gallery' ? null : h(Gallery, { ui, inline: true, onPick: id => addFromPreset(id, null) })) : h(React.Fragment, null,
            h('div', { className: 'rp-bar' },
              h('div', { className: 'rp-hint rp-grow' }, t('rules.order')),
              h('button', { type: 'button', className: 'rp-btn rp-primary', 'aria-expanded': panel === 'gallery' && galleryTarget === undefined, onClick: () => { if (panel === 'gallery' && galleryTarget === undefined) setPanel(null); else openGallery(undefined) } }, t('rule.new'))),
            h('div', { className: 'rp-list' }, rules.map((rule, index) => h(RuleRow, { key: rule.id, ui, rule, index, count: rules.length, open: openId === rule.id, problems: problemsBy.get(rule.id) ?? [], hit: hits.get(rule.id), env: checked.env }))))) : null,
          tab === 'requests' ? h(RequestsTab, { ui, recent: recent.recent, endpoints: recent.endpoints, rules: draft.rules, enabled: server.enabled, onClear: clearRecent, onPause: () => toggleMaster(false) }) : null,
          tab === 'try' ? h(TryTab, { ui, dirty, rules: draft.rules, defaultUrl: recent.endpoints[0] === undefined ? undefined : `${recent.endpoints[0].scheme ?? 'https'}://${recent.endpoints[0].host}${recent.endpoints[0].path}`, defaultModel: recent.endpoints[0]?.models[0] }) : null)
      }

      return h('div', { className: 'rp' },
        h('style', null, CSS),
        h('div', { className: 'rp-inner' },
          h('div', { className: 'rp-header' },
            h('div', { className: 'rp-titlebar' },
              h('h1', null, t('title'), server?.version === undefined ? null : h('span', { className: 'rp-version' }, `v${server.version}`)),
              h('p', { className: 'rp-sub' }, t('intro'))),
            server === null ? null : h('label', { className: 'rp-master' },
              h(Switch, { checked: server.enabled, label: t(server.enabled ? 'master.pause' : 'master.resume'), onChange: toggleMaster }),
              h('span', null, t(server.enabled ? 'master.on' : 'master.off')))),
          body,
          notice === null ? null : h('div', { className: `rp-note is-float${dirty ? ' is-above' : ''} ${{ done: 'is-done', warn: 'is-warn', busy: '' }[notice.kind]}`, role: notice.kind === 'warn' ? 'alert' : 'status' },
            h('span', { className: 'rp-grow' }, notice.text),
            notice.action === undefined ? null : h('button', { type: 'button', className: 'rp-btn', onClick: () => { const { run } = notice.action; show(null); run() } }, notice.action.label),
            h('button', { type: 'button', className: 'rp-btn', onClick: () => show(null) }, t('dismiss')))),
        dirty ? h('div', { className: 'rp-savebar', role: 'region', 'aria-label': t('save.bar') },
          confirm === 'discard' ? h(ConfirmBox, { ui, text: t('save.confirmDiscard'), action: t('save.discard'), danger: true, onCancel: () => setConfirm(null), onConfirm: discard }) : h('div', { className: 'rp-savebarinner' },
            h('div', { className: 'rp-grow' },
              h('strong', null, t('save.unsaved')),
              blockers.length > 0 ? h('div', { className: 'rp-hint is-error' }, pl(t, 'save.blocked', blockers.length)) : building.size > 0 ? h('div', { className: 'rp-hint' }, t('save.building')) : h('div', { className: 'rp-hint' }, t('save.hint'))),
            h('button', { type: 'button', className: 'rp-btn', disabled: saving, onClick: () => setConfirm('discard') }, t('save.discard')),
            h('button', { type: 'button', className: 'rp-btn rp-primary', disabled: !canSave, onClick: () => save(false) }, saving ? t('save.saving') : t('save.save')))) : null)
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
