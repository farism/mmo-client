// ported from https://github.com/aikoven/redux-typescript-actions

export interface IAction {
  type: string;
  payload: any;
  error?: boolean;
  meta?: Object;
}

export interface Action<P> extends IAction {
  type: string;
  payload: P;
  error?: boolean;
  meta?: Object;
}

export interface Success<P, S> {
  params: P;
  result: S;
}

export interface Failure<P, E> {
  params: P;
  error: E;
}

export function isType<P>(
  action: IAction,
  actionCreator: ActionCreator<P>,
): action is Action<P> {
  return action.type === actionCreator.type;
}

export interface ActionCreator<P> {
  type: string;
  (payload: P, meta?: Object): Action<P>;
}

export interface EmptyActionCreator extends ActionCreator<undefined> {
  (payload?: undefined, meta?: Object): Action<undefined>;
}

export interface AsyncActionCreators<P, S, E> {
  type: string;
  started: ActionCreator<P>;
  done: ActionCreator<Success<P, S>>;
  failed: ActionCreator<Failure<P, E>>;
}

export interface ActionCreatorFactory {
  (type: string, commonMeta?: Object, error?: boolean): EmptyActionCreator;
  <P>(type: string, commonMeta?: Object, isError?: IsError<P>): ActionCreator<P>;
  async<P, S>(type: string, commonMeta?: Object): AsyncActionCreators<P, S, any>;
  async<P, S, E>(type: string, commonMeta?: Object): AsyncActionCreators<P, S, E>;
}

export type IsError<P> = ((payload: P) => boolean) | boolean

export default function actionCreatorFactory(
  prefix?: string,
  defaultIsError: (payload: any) => boolean = p => p instanceof Error,
): ActionCreatorFactory {
  const base = prefix ? `${prefix}/` : ''

  function actionCreator <P>(
    type: string,
    commonMeta?: Object,
    isError: IsError<P> = defaultIsError,
  ): ActionCreator<P> {
    const fullType = base + type

    return Object.assign(
      (payload: P, meta?: Object) => {
        const action: Action<P> = {
          type: fullType,
          payload,
        }

        if (commonMeta || meta) {
          action.meta = Object.assign({}, commonMeta, meta)
        }

        if (isError && (typeof isError === 'boolean' || isError(payload))) {
          action.error = true
        }

        return action
      },
      {type: fullType},
    )
  }

  function asyncActionCreators<P, S, E>(
    type: string,
    commonMeta?: Object,
  ): AsyncActionCreators<P, S, E> {
    return {
      type: base + type,
      started: actionCreator<P>(`${type}_STARTED`, commonMeta, false),
      done: actionCreator<Success<P, S>>(`${type}_DONE`, commonMeta, false),
      failed: actionCreator<Failure<P, E>>(`${type}_FAILED`, commonMeta, true),
    }
  }

  return Object.assign(actionCreator, {async: asyncActionCreators})
}