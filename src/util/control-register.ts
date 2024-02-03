/**
 * 部件适配器的接口
 *
 * @author lxm
 * @date 2022-09-19 19:09:10
 * @export
 * @interface IControlProvider
 */
export interface IControlProvider {
/**
 * 部件组件
 *GridControlProvider
    * @author lxm
    * @date 2022-09-20 10:09:50
    * @type {unknown}
    */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
component: any;
}

/**
 * 适配器基类
 * @author lxm
 * @date 2023-05-06 06:48:25
 * @export
 * @interface IProvider
 */
export interface IProvider {}
type NewProvider = (...args: any[]) => IProvider;

/**
 * 注册部件适配器
 * @author lxm
 * @date 2023-05-06 09:14:16
 * @export
 * @param {string} key
 * @param {() => IControlProvider} callback 生成部件适配器的回调
 */
export function registerControlProvider(
  key: string,
  callback: () => IControlProvider
): void {
    // ibiz.register.register(`${CONTROL_PROVIDER_PREFIX}_${key}`, callback);
}

