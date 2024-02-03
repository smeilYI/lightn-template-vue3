export interface IWatermark {
  content: string[];
  target: string | HTMLElement;
  fontSize?: number;
}

export class WaterMark {
  /**
   * 监听集合
   *
   * @private
   * @static
   * @type {(Map<string | HTMLElement, MutationObserver>)}
   * @memberof WaterMark
   */
  private static observers: Map<string | HTMLElement, MutationObserver> =
    new Map();

  /**
   * 水印配置参数集合
   *
   * @private
   * @static
   * @type {(Map<string | HTMLElement, IWatermark>)}
   * @memberof WaterMark
   */
  private static watermarks: Map<string | HTMLElement, IWatermark> = new Map();

  /**
   * 水印创建节点集合
   *
   * @private
   * @static
   * @type {(Map<string | HTMLElement, HTMLElement>)}
   * @memberof WaterMark
   */
  private static watermarkNodes: Map<string | HTMLElement, HTMLElement> =
    new Map();

  /**
   * 创建canvas
   *
   * @private
   * @static
   * @param {IWatermark} watermark
   * @return {*}
   * @memberof WaterMark
   */
  private static createCanvas(watermark: IWatermark) {
    const { content, fontSize } = watermark;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // if (ctx) {
    //   const font = `${fontSize || 20}px serif`;
    //   ctx.fillStyle = 'rgba(100,100,100,0.2)';
    //   ctx.font = font;
    //   ctx.rotate((-20 * Math.PI) / 180);
    //   content.forEach((text: string, index: number) => {
    //     ctx.fillText(text, 0, 20 * (index + 1));
    //   });
    // }
    // const content = ['测试123', '测试'];
    if (ctx) {
    const font = `${fontSize || 20}px serif`;
    ctx.fillStyle = 'rgba(100,100,100,0.2)';
    ctx.font = font;

    // Save the current canvas state before rotation
    ctx.save();
    console.log('canvas.width', 600, 150);
    
    ctx.translate(0, canvas.height / 2);
    ctx.rotate((-20 * Math.PI) / 180);
    content.forEach((text, index) => {
      // Adjust text positioning after rotation
      ctx.fillText(text, 0, 20 * (index + 1), 900);
    });

    // Restore the canvas state to prevent the rotation from affecting subsequent drawings
    ctx.restore();
  }

    return {
      base64: canvas.toDataURL('image/png'),
    };
  }

  /**
   * 水印DOM变化
   *
   * @private
   * @static
   * @param {HTMLElement} target
   * @memberof WaterMark
   */
  private static handleWaterMarkDOMChange(target: HTMLElement) {
    const tempWaterMarkNode = this.watermarkNodes.get(target) as HTMLElement;
    const tempWatermark = this.watermarks.get(target) as IWatermark;
    let waterMarkNodeType = false;
    if (target.children) {
      for (let i = 0; i < target.children?.length; i++) {
        if (tempWaterMarkNode === target.children[i]) {
          waterMarkNodeType = true;
        }
      }
      if (waterMarkNodeType) {
        this.setWaterMark(tempWaterMarkNode as HTMLElement, tempWatermark);
      } else {
        // 没有节点，重新创建
        this.createWaterMark(tempWatermark);
      }
    }
  }

  /**
   * 监听DOM变化防止水印被删除
   *
   * @private
   * @static
   * @param {HTMLElement} targetNode
   * @param {IWatermark} watermark
   * @memberof WaterMark
   */
  private static listenerDOMChange(
    targetNode: HTMLElement,
    watermark: IWatermark,
  ) {
    const { target } = watermark;
    if (targetNode && !this.observers.has(target)) {
      const observer = new MutationObserver(mutationsList => {
        for (let i = 0; i < mutationsList?.length; i++) {
          // 水印容器DOM变化
          if (this.observers.has(mutationsList[i]?.target as HTMLElement)) {
            this.handleWaterMarkDOMChange(
              mutationsList[i]?.target as HTMLElement,
            );
          }
          // 创建的水印DOM变化
          if (
            this.observers.has(
              mutationsList[i]?.target.parentNode as HTMLElement,
            )
          ) {
            this.handleWaterMarkDOMChange(
              mutationsList[i]?.target.parentNode as HTMLElement,
            );
          }
        }
      });
      observer.observe(targetNode as Node, {
        childList: true,
        attributes: true,
        subtree: true,
        characterData: true,
      });
      this.observers.set(targetNode, observer);
    }
  }

  /**
   * 处理及获取节点
   *
   * @static
   * @param {(string | HTMLElement)} target
   * @return {*}
   * @memberof WaterMark
   */
  static handleTargetNode(target: string | HTMLElement) {
    let targetNode = null;
    if (typeof target === 'string') {
      targetNode = document.querySelector(`${target}`) as HTMLElement;
    } else {
      targetNode = target;
    }
    return targetNode;
  }

  /**
   * 创建水印
   *
   * @static
   * @param {IWatermark} watermark
   * @return {*}
   * @memberof WaterMark
   */
  static createWaterMark(watermark: IWatermark) {
    const { target } = watermark;
    const targetNode = this.handleTargetNode(target);
    if (targetNode) {
      const waterMarkNode = document.createElement('div');
      targetNode.appendChild(waterMarkNode);
      this.setWaterMark(waterMarkNode, watermark);
      this.listenerDOMChange(targetNode, watermark);
      this.watermarks.set(targetNode, watermark);
      this.watermarkNodes.set(targetNode, waterMarkNode);
    } else {
      throw new Error(`没有此节点: ${target}`);
    }
  }

  /**
   * 设置水印
   *
   * @static
   * @param {HTMLElement} defaultNode
   * @param {IWatermark} watermark
   * @memberof WaterMark
   */
  static setWaterMark(defaultNode: HTMLElement, watermark: IWatermark) {
    const { base64 } = this.createCanvas(watermark);
    const defaultStyle = {
      top: 0,
      left: 0,
      content: '',
      width: '100%',
      height: '100%',
      display: 'block',
      position: 'absolute',
      pointerEvents: 'none',
      backgroundRepeat: 'repeat',
      backgroundImage: `url(${base64})`,
    };
    Object.assign(defaultNode.style, defaultStyle);
  }

  /**
   * 销毁水印节点及MutationObserver
   *
   * @static
   * @param {(string | HTMLElement)} target
   * @memberof WaterMark
   */
  static destroyListenerDOM(target: string | HTMLElement) {
    const targetNode = this.handleTargetNode(target);
    if (targetNode) {
      if (this.observers.has(targetNode)) {
        const observer = this.observers.get(targetNode) as MutationObserver;
        observer.disconnect();
        this.observers.delete(targetNode);
      }
      if (this.watermarks.has(targetNode)) {
        this.watermarks.delete(targetNode);
      }
      if (this.watermarkNodes.has(targetNode)) {
        const waterMarkNode = this.watermarkNodes.get(
          targetNode,
        ) as HTMLElement;
        waterMarkNode.remove();
        this.watermarkNodes.delete(targetNode);
      }
    }
  }
}
