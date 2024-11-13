import { defineComponent } from '@vue-mini/core';

/**
 * @fileoverview 递归子组件，用于显示节点树
 */
defineComponent({
  data: {
    ctrl: {} as any, // 控制信号,
    isiOS: wx.getSystemInfoSync().system.includes('iOS'),
    root: null as any,
  },
  properties: {
    childs: {
      type: Array,
      value: [] as any[],
    }, // 子节点列表
    opts: Array, // 设置 [是否开启懒加载, 加载中占位图, 错误占位图, 是否使用长按菜单]
  },
  options: {
    addGlobalClass: true,
  },
  attached() {
    this.triggerEvent('add', this, {
      bubbles: true,
      composed: true,
    });
  },
  methods: {
    /**
     * @description 获取标签
     * @param {String} path 路径
     */
    getNode(path: string) {
      try {
        const nums: any[] = path.split('_');
        let node = this.properties.childs[nums[0]];
        for (let i = 1; i < nums.length; i++) {
          node = node.children[nums[i]];
        }
        return node;
      } catch {
        return {
          text: '',
          attrs: {},
          children: [],
        };
      }
    },
    /**
     * @description 播放视频事件
     * @param {Event} e
     */
    play(e: WechatMiniprogram.BaseEvent) {
      const i = e.target.dataset.i;
      const node = this.getNode(i);
      const videos = this.data.root.data.videos;
      this.data.root.triggerEvent('play', {
        source: node.name,
        attrs: {
          ...node.attrs,
          src: node.src[this.data.ctrl[i] || 0],
        },
      });
      if (this.data.root.properties.pauseVideo) {
        let flag = false;
        const id = e.target.id;

        for (let i = videos.length; i--; ) {
          if (videos[i].id === id) {
            flag = true;
          } else {
            videos[i].pause(); // 自动暂停其他视频
          }
        }
        // 将自己加入列表
        if (!flag) {
          const ctx = wx.createVideoContext(id, this);
          // @ts-ignore
          ctx.id = id;
          if (this.data.root.data.playbackRate) {
            ctx.playbackRate(this.data.root.data.playbackRate);
          }
          videos.push(ctx);
        }
      }
    },

    /**
     * @description 图片点击事件
     * @param {Event} e
     */
    imgTap(e: WechatMiniprogram.BaseEvent) {
      const node = this.getNode(e.target.dataset.i);
      // 父级中有链接
      if (node.a) return this.linkTap(node.a);
      if (node.attrs.ignore) return;
      const root = this.data.root;
      root.triggerEvent('imgtap', node.attrs);
      if (root.properties.previewImg) {
        const current = root.data.imgList[node.i];
        wx.previewImage({
          showmenu: root.properties.showImgMenu,
          enablesavephoto: root.properties.showImgMenu,
          enableShowPhotoDownload: root.properties.showImgMenu,
          current,
          urls: root.data.imgList,
        });
      }
    },

    /**
     * @description 图片加载完成事件
     * @param {Event} e
     */
    imgLoad(e: WechatMiniprogram.CustomEvent) {
      const i = e.target.dataset.i;
      const node = this.getNode(i);
      let val;
      if (!node.w) {
        val = e.detail.width;
      } else if (
        (this.properties.opts[1] && !this.data.ctrl[i]) ||
        this.data.ctrl[i] === -1
      ) {
        // 加载完毕，取消加载中占位图
        val = 1;
      }
      if (
        val &&
        // #ifdef MP-TOUTIAO
        val !== this.data.ctrl[i] // eslint-disable-line
        // #endif
      ) {
        this.setData({
          ['ctrl.' + i]: val,
        });
      }
      this.checkReady();
    },

    /**
     * @description 检查是否所有图片加载完毕
     */
    checkReady() {
      const root = this.data.root;
      if (!root.properties?.lazyLoad) {
        root.data.unloadimgs -= 1;
        if (!root.data.unloadimgs) {
          setTimeout(() => {
            root
              .getRect()
              .then((rect: WechatMiniprogram.ClientRect) => {
                root.triggerEvent('ready', rect);
              })
              .catch(() => {
                root.triggerEvent('ready', {});
              });
          }, 350);
        }
      }
    },

    /**
     * @description 链接点击事件
     * @param {Event} e
     */
    linkTap(e: WechatMiniprogram.BaseEvent) {
      const node = e.currentTarget
        ? this.getNode(e.currentTarget.dataset.i)
        : {};
      const attrs = node.attrs || e;
      const href = attrs.href;
      this.data.root.triggerEvent(
        'linktap',
        Object.assign(
          {
            innerText: this.data.root.getText(node.children || []), // 链接内的文本内容
          },
          attrs,
        ),
      );
      if (href) {
        if (href[0] === '#') {
          // 跳转锚点
          this.data.root.navigateTo(href.substring(1)).catch(() => {});
        } else if (href.split('?')[0].includes('://')) {
          // 复制外部链接
          if (this.data.root.properties.copyLink) {
            wx.setClipboardData({
              data: href,
              success: () =>
                wx.showToast({
                  title: '链接已复制',
                }),
            });
          }
        } else {
          // 跳转页面
          wx.navigateTo({
            url: href,
            fail() {
              wx.switchTab({
                url: href,
                fail() {},
              });
            },
          });
        }
      }
    },

    /**
     * @description 错误事件
     * @param {Event} e
     */
    mediaError(e: WechatMiniprogram.CustomEvent) {
      const i = e.target.dataset.i;
      const node = this.getNode(i);
      if (node.name === 'video' || node.name === 'audio') {
        // 加载其他源
        let index = (this.data.ctrl[i] || 0) + 1;
        if (index > node.src.length) {
          index = 0;
        }
        if (index < node.src.length) {
          return this.setData({
            ['ctrl.' + i]: index,
          });
        }
      } else if (node.name === 'img') {
        // 显示错误占位图
        if (this.properties.opts[2]) {
          this.setData({
            ['ctrl.' + i]: -1,
          });
        }
        this.checkReady();
      }
      if (this.data.root) {
        this.data.root.triggerEvent('error', {
          source: node.name,
          attrs: node.attrs,
          errMsg: e.detail.errMsg,
        });
      }
    },
  },

  setup(_props, _context) {
    const inlineTags: Record<string, any> = {
      abbr: true,
      b: true,
      big: true,
      code: true,
      del: true,
      em: true,
      i: true,
      ins: true,
      label: true,
      q: true,
      small: true,
      span: true,
      strong: true,
      sub: true,
      sup: true,
      table: true,
    };

    const isInline = (tagName: string, style: string) => {
      return inlineTags[tagName] || (style || '').indexOf('inline') === -1;
    };

    return { isInline };
  },
});
