/** onInit hook token */
export const onInitToken = Symbol("OnInit");

/** onInit hook interface */
export interface OnInit {
  [onInitToken](): Promise<void> | void;
}

/** onInit hook mixin */
export const onInit = (cb: () => Promise<void> | void): OnInit => ({
  [onInitToken]: cb,
});

/** Checks if given value is onInit */
export const isOnInit = (val: any): val is OnInit =>
  val?.[onInitToken] !== undefined;

/** Runs onInit hook */
export const runOnInit = (val: OnInit) => val[onInitToken]();

/** onStart hook token */
export const onStartToken = Symbol("OnStart");

/** onStart hook interface */
export interface OnStart {
  [onStartToken](): Promise<void> | void;
}

/** onStart hook mixin */
export const onStart = (cb: () => Promise<void> | void): OnStart => ({
  [onStartToken]: cb,
});

/** Checks if given value is onStart */
export const isOnStart = (val: any): val is OnStart =>
  val?.[onStartToken] !== undefined;

/** Runs onStart hook */
export const runOnStart = (val: OnStart) => val[onStartToken]();

/** onDestroy hook token */
export const onDestroyToken = Symbol("OnDestroy");

/** onDestroy hook interface */
export interface OnDestroy {
  [onDestroyToken](): Promise<void> | void;
}

/** onDestroy hook mixin */
export const onDestroy = (cb: () => Promise<void> | void): OnDestroy => ({
  [onDestroyToken]: cb,
});

/** Checks if given value is onDestroy */
export const isOnDestroy = (val: any): val is OnDestroy =>
  val?.[onDestroyToken] !== undefined;

/** Runs onDestroy hook */
export const runOnDestroy = (val: OnDestroy) => val[onDestroyToken]();
