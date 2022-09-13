/*! For license information please see index.js.LICENSE.txt */
(() => {
  "use strict";
  var t = {
    n: (e) => {
      var r = e && e.__esModule ? () => e.default : () => e;
      return t.d(r, { a: r }), r;
    },
    d: (e, r) => {
      for (var n in r)
        t.o(r, n) &&
          !t.o(e, n) &&
          Object.defineProperty(e, n, { enumerable: !0, get: r[n] });
    },
    o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
  };
  const e = require("express");
  var r = t.n(e);
  const n = require("cors");
  var o = t.n(n);
  const i = require("helmet");
  var a = t.n(i);
  require("morgan"), require("fs");
  const c = require("path");
  var u = t.n(c);
  const s = require("express-session");
  var l = t.n(s);
  const f = require("dotenv");
  var h = process.env,
    p = h.REDIS_PORT,
    v = void 0 === p ? 6379 : p,
    d = h.REDIS_HOST,
    y = void 0 === d ? "localhost" : d,
    m = h.REDIS_PASSWORD,
    g = { port: +v, host: y, password: void 0 === m ? "secret" : m },
    w = process.env,
    b = w.POSTGRESQL_USER,
    x = void 0 === b ? "admin" : b,
    O = w.POSTGRESQL_PASSWORD,
    E = void 0 === O ? "admin" : O,
    S = w.POSTGRESQL_PORT,
    L = void 0 === S ? "5432" : S,
    j = w.POSTGRESQL_HOST,
    P = void 0 === j ? "localhost" : j,
    _ =
      (void 0 === process.env.DATABASE_URL &&
        "postgres://"
          .concat(x, ":")
          .concat(E, "@")
          .concat(P, ":")
          .concat(L),
      process.env),
    k = _.SESSION_SECRET,
    R = void 0 === k ? "secret" : k,
    T = _.SESSION_NAME,
    G = void 0 === T ? "sid" : T,
    N = _.SESSION_TIMEOUT,
    q = {
      secret: R,
      name: G,
      cookie: { maxAge: +(void 0 === N ? 216e5 : N), secure: !0 },
      resave: !1,
      saveUninitialized: !1,
      rolling: !0,
    },
    I = process.env.PORT;
  (0, f.config)();
  const A = require("ioredis");
  var C = t.n(A);
  const D = require("connect-redis");
  var F = t.n(D);
  function M(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n);
    }
  }
  const U = (function () {
      function t() {
        !(function (t, e) {
          if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function");
        })(this, t),
          (this.RedisStore = F()(l())),
          (this.redisClient = new (C())(g)),
          this.redisClient.on("error", function () {
            throw "Error connecting with redis client";
          });
      }
      var e, r;
      return (
        (e = t),
        (r = [
          {
            key: "redisStore",
            get: function () {
              return new this.RedisStore({
                client: this.redisClient,
              });
            },
          },
        ]) && M(e.prototype, r),
        Object.defineProperty(e, "prototype", { writable: !1 }),
        t
      );
    })(),
    z = require("joi");
  var Q = t.n(z);
  const Y = require("bcryptjs"),
    H = require("bcrypt"),
    B = require("@prisma/client");
  function W(t) {
    return (
      (W =
        "function" == typeof Symbol &&
        "symbol" == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : typeof t;
            }),
      W(t)
    );
  }
  function J() {
    J = function () {
      return t;
    };
    var t = {},
      e = Object.prototype,
      r = e.hasOwnProperty,
      n = "function" == typeof Symbol ? Symbol : {},
      o = n.iterator || "@@iterator",
      i = n.asyncIterator || "@@asyncIterator",
      a = n.toStringTag || "@@toStringTag";
    function c(t, e, r) {
      return (
        Object.defineProperty(t, e, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        }),
        t[e]
      );
    }
    try {
      c({}, "");
    } catch (t) {
      c = function (t, e, r) {
        return (t[e] = r);
      };
    }
    function u(t, e, r, n) {
      var o = e && e.prototype instanceof f ? e : f,
        i = Object.create(o.prototype),
        a = new E(n || []);
      return (
        (i._invoke = (function (t, e, r) {
          var n = "suspendedStart";
          return function (o, i) {
            if ("executing" === n)
              throw new Error("Generator is already running");
            if ("completed" === n) {
              if ("throw" === o) throw i;
              return { value: void 0, done: !0 };
            }
            for (r.method = o, r.arg = i; ; ) {
              var a = r.delegate;
              if (a) {
                var c = b(a, r);
                if (c) {
                  if (c === l) continue;
                  return c;
                }
              }
              if ("next" === r.method) r.sent = r._sent = r.arg;
              else if ("throw" === r.method) {
                if ("suspendedStart" === n)
                  throw ((n = "completed"), r.arg);
                r.dispatchException(r.arg);
              } else
                "return" === r.method && r.abrupt("return", r.arg);
              n = "executing";
              var u = s(t, e, r);
              if ("normal" === u.type) {
                if (
                  ((n = r.done ? "completed" : "suspendedYield"),
                  u.arg === l)
                )
                  continue;
                return { value: u.arg, done: r.done };
              }
              "throw" === u.type &&
                ((n = "completed"),
                (r.method = "throw"),
                (r.arg = u.arg));
            }
          };
        })(t, r, a)),
        i
      );
    }
    function s(t, e, r) {
      try {
        return { type: "normal", arg: t.call(e, r) };
      } catch (t) {
        return { type: "throw", arg: t };
      }
    }
    t.wrap = u;
    var l = {};
    function f() {}
    function h() {}
    function p() {}
    var v = {};
    c(v, o, function () {
      return this;
    });
    var d = Object.getPrototypeOf,
      y = d && d(d(S([])));
    y && y !== e && r.call(y, o) && (v = y);
    var m = (p.prototype = f.prototype = Object.create(v));
    function g(t) {
      ["next", "throw", "return"].forEach(function (e) {
        c(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function w(t, e) {
      function n(o, i, a, c) {
        var u = s(t[o], t, i);
        if ("throw" !== u.type) {
          var l = u.arg,
            f = l.value;
          return f && "object" == W(f) && r.call(f, "__await")
            ? e.resolve(f.__await).then(
                function (t) {
                  n("next", t, a, c);
                },
                function (t) {
                  n("throw", t, a, c);
                },
              )
            : e.resolve(f).then(
                function (t) {
                  (l.value = t), a(l);
                },
                function (t) {
                  return n("throw", t, a, c);
                },
              );
        }
        c(u.arg);
      }
      var o;
      this._invoke = function (t, r) {
        function i() {
          return new e(function (e, o) {
            n(t, r, e, o);
          });
        }
        return (o = o ? o.then(i, i) : i());
      };
    }
    function b(t, e) {
      var r = t.iterator[e.method];
      if (void 0 === r) {
        if (((e.delegate = null), "throw" === e.method)) {
          if (
            t.iterator.return &&
            ((e.method = "return"),
            (e.arg = void 0),
            b(t, e),
            "throw" === e.method)
          )
            return l;
          (e.method = "throw"),
            (e.arg = new TypeError(
              "The iterator does not provide a 'throw' method",
            ));
        }
        return l;
      }
      var n = s(r, t.iterator, e.arg);
      if ("throw" === n.type)
        return (
          (e.method = "throw"),
          (e.arg = n.arg),
          (e.delegate = null),
          l
        );
      var o = n.arg;
      return o
        ? o.done
          ? ((e[t.resultName] = o.value),
            (e.next = t.nextLoc),
            "return" !== e.method &&
              ((e.method = "next"), (e.arg = void 0)),
            (e.delegate = null),
            l)
          : o
        : ((e.method = "throw"),
          (e.arg = new TypeError("iterator result is not an object")),
          (e.delegate = null),
          l);
    }
    function x(t) {
      var e = { tryLoc: t[0] };
      1 in t && (e.catchLoc = t[1]),
        2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
        this.tryEntries.push(e);
    }
    function O(t) {
      var e = t.completion || {};
      (e.type = "normal"), delete e.arg, (t.completion = e);
    }
    function E(t) {
      (this.tryEntries = [{ tryLoc: "root" }]),
        t.forEach(x, this),
        this.reset(!0);
    }
    function S(t) {
      if (t) {
        var e = t[o];
        if (e) return e.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var n = -1,
            i = function e() {
              for (; ++n < t.length; )
                if (r.call(t, n))
                  return (e.value = t[n]), (e.done = !1), e;
              return (e.value = void 0), (e.done = !0), e;
            };
          return (i.next = i);
        }
      }
      return { next: L };
    }
    function L() {
      return { value: void 0, done: !0 };
    }
    return (
      (h.prototype = p),
      c(m, "constructor", p),
      c(p, "constructor", h),
      (h.displayName = c(p, a, "GeneratorFunction")),
      (t.isGeneratorFunction = function (t) {
        var e = "function" == typeof t && t.constructor;
        return (
          !!e &&
          (e === h ||
            "GeneratorFunction" === (e.displayName || e.name))
        );
      }),
      (t.mark = function (t) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(t, p)
            : ((t.__proto__ = p), c(t, a, "GeneratorFunction")),
          (t.prototype = Object.create(m)),
          t
        );
      }),
      (t.awrap = function (t) {
        return { __await: t };
      }),
      g(w.prototype),
      c(w.prototype, i, function () {
        return this;
      }),
      (t.AsyncIterator = w),
      (t.async = function (e, r, n, o, i) {
        void 0 === i && (i = Promise);
        var a = new w(u(e, r, n, o), i);
        return t.isGeneratorFunction(r)
          ? a
          : a.next().then(function (t) {
              return t.done ? t.value : a.next();
            });
      }),
      g(m),
      c(m, a, "Generator"),
      c(m, o, function () {
        return this;
      }),
      c(m, "toString", function () {
        return "[object Generator]";
      }),
      (t.keys = function (t) {
        var e = [];
        for (var r in t) e.push(r);
        return (
          e.reverse(),
          function r() {
            for (; e.length; ) {
              var n = e.pop();
              if (n in t) return (r.value = n), (r.done = !1), r;
            }
            return (r.done = !0), r;
          }
        );
      }),
      (t.values = S),
      (E.prototype = {
        constructor: E,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = void 0),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = void 0),
            this.tryEntries.forEach(O),
            !t)
          )
            for (var e in this)
              "t" === e.charAt(0) &&
                r.call(this, e) &&
                !isNaN(+e.slice(1)) &&
                (this[e] = void 0);
        },
        stop: function () {
          this.done = !0;
          var t = this.tryEntries[0].completion;
          if ("throw" === t.type) throw t.arg;
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) throw t;
          var e = this;
          function n(r, n) {
            return (
              (a.type = "throw"),
              (a.arg = t),
              (e.next = r),
              n && ((e.method = "next"), (e.arg = void 0)),
              !!n
            );
          }
          for (var o = this.tryEntries.length - 1; o >= 0; --o) {
            var i = this.tryEntries[o],
              a = i.completion;
            if ("root" === i.tryLoc) return n("end");
            if (i.tryLoc <= this.prev) {
              var c = r.call(i, "catchLoc"),
                u = r.call(i, "finallyLoc");
              if (c && u) {
                if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                if (this.prev < i.finallyLoc) return n(i.finallyLoc);
              } else if (c) {
                if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
              } else {
                if (!u)
                  throw new Error(
                    "try statement without catch or finally",
                  );
                if (this.prev < i.finallyLoc) return n(i.finallyLoc);
              }
            }
          }
        },
        abrupt: function (t, e) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var o = this.tryEntries[n];
            if (
              o.tryLoc <= this.prev &&
              r.call(o, "finallyLoc") &&
              this.prev < o.finallyLoc
            ) {
              var i = o;
              break;
            }
          }
          i &&
            ("break" === t || "continue" === t) &&
            i.tryLoc <= e &&
            e <= i.finallyLoc &&
            (i = null);
          var a = i ? i.completion : {};
          return (
            (a.type = t),
            (a.arg = e),
            i
              ? ((this.method = "next"),
                (this.next = i.finallyLoc),
                l)
              : this.complete(a)
          );
        },
        complete: function (t, e) {
          if ("throw" === t.type) throw t.arg;
          return (
            "break" === t.type || "continue" === t.type
              ? (this.next = t.arg)
              : "return" === t.type
              ? ((this.rval = this.arg = t.arg),
                (this.method = "return"),
                (this.next = "end"))
              : "normal" === t.type && e && (this.next = e),
            l
          );
        },
        finish: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.finallyLoc === t)
              return this.complete(r.completion, r.afterLoc), O(r), l;
          }
        },
        catch: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.tryLoc === t) {
              var n = r.completion;
              if ("throw" === n.type) {
                var o = n.arg;
                O(r);
              }
              return o;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, e, r) {
          return (
            (this.delegate = {
              iterator: S(t),
              resultName: e,
              nextLoc: r,
            }),
            "next" === this.method && (this.arg = void 0),
            l
          );
        },
      }),
      t
    );
  }
  function K(t, e, r, n, o, i, a) {
    try {
      var c = t[i](a),
        u = c.value;
    } catch (t) {
      return void r(t);
    }
    c.done ? e(u) : Promise.resolve(u).then(n, o);
  }
  function V(t) {
    return function () {
      var e = this,
        r = arguments;
      return new Promise(function (n, o) {
        var i = t.apply(e, r);
        function a(t) {
          K(i, n, o, a, c, "next", t);
        }
        function c(t) {
          K(i, n, o, a, c, "throw", t);
        }
        a(void 0);
      });
    };
  }
  function X(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n);
    }
  }
  function Z(t, e, r) {
    return (
      e && X(t.prototype, e),
      r && X(t, r),
      Object.defineProperty(t, "prototype", { writable: !1 }),
      t
    );
  }
  function $(t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
      t
    );
  }
  const tt = Z(function t() {
    var e = this;
    !(function (t, e) {
      if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function");
    })(this, t),
      $(
        this,
        "encryptPassword",
        (function () {
          var t = V(
            J().mark(function t(e) {
              var r, n;
              return J().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (t.next = 2), (0, Y.genSalt)(10);
                    case 2:
                      return (
                        (r = t.sent), (t.next = 5), (0, H.hash)(e, r)
                      );
                    case 5:
                      return (n = t.sent), t.abrupt("return", n);
                    case 7:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          );
          return function (e) {
            return t.apply(this, arguments);
          };
        })(),
      ),
      $(this, "comparePassword", function (t, e) {
        return (0, H.compare)(t, e);
      }),
      $(this, "getUserFromEmail", function (t) {
        return new Promise(function (r, n) {
          V(
            J().mark(function o() {
              var i;
              return J().wrap(
                function (o) {
                  for (;;)
                    switch ((o.prev = o.next)) {
                      case 0:
                        return (
                          (o.prev = 0),
                          (o.next = 3),
                          e.prisma.user.findUnique({
                            where: { email: t },
                          })
                        );
                      case 3:
                        return (i = o.sent), o.abrupt("return", r(i));
                      case 7:
                        return (
                          (o.prev = 7),
                          (o.t0 = o.catch(0)),
                          o.abrupt("return", n(o.t0))
                        );
                      case 10:
                      case "end":
                        return o.stop();
                    }
                },
                o,
                null,
                [[0, 7]],
              );
            }),
          )();
        });
      }),
      $(this, "register", function (t) {
        var r = t.email;
        return new Promise(function (n, o) {
          V(
            J().mark(function i() {
              var a, c;
              return J().wrap(
                function (i) {
                  for (;;)
                    switch ((i.prev = i.next)) {
                      case 0:
                        return (
                          (i.prev = 0),
                          (i.next = 3),
                          e.getUserFromEmail(r)
                        );
                      case 3:
                        if (!i.sent) {
                          i.next = 6;
                          break;
                        }
                        return i.abrupt(
                          "return",
                          o({
                            error:
                              "User with this email already exists",
                            code: 409,
                          }),
                        );
                      case 6:
                        return (
                          (i.next = 8), e.encryptPassword(t.password)
                        );
                      case 8:
                        return (
                          (t.password = i.sent),
                          (i.next = 11),
                          e.prisma.user.create({ data: t })
                        );
                      case 11:
                        return (
                          (a = i.sent),
                          (c = a.id),
                          i.abrupt("return", n(c))
                        );
                      case 16:
                        return (
                          (i.prev = 16),
                          (i.t0 = i.catch(0)),
                          i.abrupt(
                            "return",
                            o({ error: i.t0, code: 503 }),
                          )
                        );
                      case 19:
                      case "end":
                        return i.stop();
                    }
                },
                i,
                null,
                [[0, 16]],
              );
            }),
          )();
        });
      }),
      (this.prisma = new B.PrismaClient());
  });
  function et(t) {
    return (
      (et =
        "function" == typeof Symbol &&
        "symbol" == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : typeof t;
            }),
      et(t)
    );
  }
  function rt() {
    rt = function () {
      return t;
    };
    var t = {},
      e = Object.prototype,
      r = e.hasOwnProperty,
      n = "function" == typeof Symbol ? Symbol : {},
      o = n.iterator || "@@iterator",
      i = n.asyncIterator || "@@asyncIterator",
      a = n.toStringTag || "@@toStringTag";
    function c(t, e, r) {
      return (
        Object.defineProperty(t, e, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        }),
        t[e]
      );
    }
    try {
      c({}, "");
    } catch (t) {
      c = function (t, e, r) {
        return (t[e] = r);
      };
    }
    function u(t, e, r, n) {
      var o = e && e.prototype instanceof f ? e : f,
        i = Object.create(o.prototype),
        a = new E(n || []);
      return (
        (i._invoke = (function (t, e, r) {
          var n = "suspendedStart";
          return function (o, i) {
            if ("executing" === n)
              throw new Error("Generator is already running");
            if ("completed" === n) {
              if ("throw" === o) throw i;
              return { value: void 0, done: !0 };
            }
            for (r.method = o, r.arg = i; ; ) {
              var a = r.delegate;
              if (a) {
                var c = b(a, r);
                if (c) {
                  if (c === l) continue;
                  return c;
                }
              }
              if ("next" === r.method) r.sent = r._sent = r.arg;
              else if ("throw" === r.method) {
                if ("suspendedStart" === n)
                  throw ((n = "completed"), r.arg);
                r.dispatchException(r.arg);
              } else
                "return" === r.method && r.abrupt("return", r.arg);
              n = "executing";
              var u = s(t, e, r);
              if ("normal" === u.type) {
                if (
                  ((n = r.done ? "completed" : "suspendedYield"),
                  u.arg === l)
                )
                  continue;
                return { value: u.arg, done: r.done };
              }
              "throw" === u.type &&
                ((n = "completed"),
                (r.method = "throw"),
                (r.arg = u.arg));
            }
          };
        })(t, r, a)),
        i
      );
    }
    function s(t, e, r) {
      try {
        return { type: "normal", arg: t.call(e, r) };
      } catch (t) {
        return { type: "throw", arg: t };
      }
    }
    t.wrap = u;
    var l = {};
    function f() {}
    function h() {}
    function p() {}
    var v = {};
    c(v, o, function () {
      return this;
    });
    var d = Object.getPrototypeOf,
      y = d && d(d(S([])));
    y && y !== e && r.call(y, o) && (v = y);
    var m = (p.prototype = f.prototype = Object.create(v));
    function g(t) {
      ["next", "throw", "return"].forEach(function (e) {
        c(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function w(t, e) {
      function n(o, i, a, c) {
        var u = s(t[o], t, i);
        if ("throw" !== u.type) {
          var l = u.arg,
            f = l.value;
          return f && "object" == et(f) && r.call(f, "__await")
            ? e.resolve(f.__await).then(
                function (t) {
                  n("next", t, a, c);
                },
                function (t) {
                  n("throw", t, a, c);
                },
              )
            : e.resolve(f).then(
                function (t) {
                  (l.value = t), a(l);
                },
                function (t) {
                  return n("throw", t, a, c);
                },
              );
        }
        c(u.arg);
      }
      var o;
      this._invoke = function (t, r) {
        function i() {
          return new e(function (e, o) {
            n(t, r, e, o);
          });
        }
        return (o = o ? o.then(i, i) : i());
      };
    }
    function b(t, e) {
      var r = t.iterator[e.method];
      if (void 0 === r) {
        if (((e.delegate = null), "throw" === e.method)) {
          if (
            t.iterator.return &&
            ((e.method = "return"),
            (e.arg = void 0),
            b(t, e),
            "throw" === e.method)
          )
            return l;
          (e.method = "throw"),
            (e.arg = new TypeError(
              "The iterator does not provide a 'throw' method",
            ));
        }
        return l;
      }
      var n = s(r, t.iterator, e.arg);
      if ("throw" === n.type)
        return (
          (e.method = "throw"),
          (e.arg = n.arg),
          (e.delegate = null),
          l
        );
      var o = n.arg;
      return o
        ? o.done
          ? ((e[t.resultName] = o.value),
            (e.next = t.nextLoc),
            "return" !== e.method &&
              ((e.method = "next"), (e.arg = void 0)),
            (e.delegate = null),
            l)
          : o
        : ((e.method = "throw"),
          (e.arg = new TypeError("iterator result is not an object")),
          (e.delegate = null),
          l);
    }
    function x(t) {
      var e = { tryLoc: t[0] };
      1 in t && (e.catchLoc = t[1]),
        2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
        this.tryEntries.push(e);
    }
    function O(t) {
      var e = t.completion || {};
      (e.type = "normal"), delete e.arg, (t.completion = e);
    }
    function E(t) {
      (this.tryEntries = [{ tryLoc: "root" }]),
        t.forEach(x, this),
        this.reset(!0);
    }
    function S(t) {
      if (t) {
        var e = t[o];
        if (e) return e.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var n = -1,
            i = function e() {
              for (; ++n < t.length; )
                if (r.call(t, n))
                  return (e.value = t[n]), (e.done = !1), e;
              return (e.value = void 0), (e.done = !0), e;
            };
          return (i.next = i);
        }
      }
      return { next: L };
    }
    function L() {
      return { value: void 0, done: !0 };
    }
    return (
      (h.prototype = p),
      c(m, "constructor", p),
      c(p, "constructor", h),
      (h.displayName = c(p, a, "GeneratorFunction")),
      (t.isGeneratorFunction = function (t) {
        var e = "function" == typeof t && t.constructor;
        return (
          !!e &&
          (e === h ||
            "GeneratorFunction" === (e.displayName || e.name))
        );
      }),
      (t.mark = function (t) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(t, p)
            : ((t.__proto__ = p), c(t, a, "GeneratorFunction")),
          (t.prototype = Object.create(m)),
          t
        );
      }),
      (t.awrap = function (t) {
        return { __await: t };
      }),
      g(w.prototype),
      c(w.prototype, i, function () {
        return this;
      }),
      (t.AsyncIterator = w),
      (t.async = function (e, r, n, o, i) {
        void 0 === i && (i = Promise);
        var a = new w(u(e, r, n, o), i);
        return t.isGeneratorFunction(r)
          ? a
          : a.next().then(function (t) {
              return t.done ? t.value : a.next();
            });
      }),
      g(m),
      c(m, a, "Generator"),
      c(m, o, function () {
        return this;
      }),
      c(m, "toString", function () {
        return "[object Generator]";
      }),
      (t.keys = function (t) {
        var e = [];
        for (var r in t) e.push(r);
        return (
          e.reverse(),
          function r() {
            for (; e.length; ) {
              var n = e.pop();
              if (n in t) return (r.value = n), (r.done = !1), r;
            }
            return (r.done = !0), r;
          }
        );
      }),
      (t.values = S),
      (E.prototype = {
        constructor: E,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = void 0),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = void 0),
            this.tryEntries.forEach(O),
            !t)
          )
            for (var e in this)
              "t" === e.charAt(0) &&
                r.call(this, e) &&
                !isNaN(+e.slice(1)) &&
                (this[e] = void 0);
        },
        stop: function () {
          this.done = !0;
          var t = this.tryEntries[0].completion;
          if ("throw" === t.type) throw t.arg;
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) throw t;
          var e = this;
          function n(r, n) {
            return (
              (a.type = "throw"),
              (a.arg = t),
              (e.next = r),
              n && ((e.method = "next"), (e.arg = void 0)),
              !!n
            );
          }
          for (var o = this.tryEntries.length - 1; o >= 0; --o) {
            var i = this.tryEntries[o],
              a = i.completion;
            if ("root" === i.tryLoc) return n("end");
            if (i.tryLoc <= this.prev) {
              var c = r.call(i, "catchLoc"),
                u = r.call(i, "finallyLoc");
              if (c && u) {
                if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                if (this.prev < i.finallyLoc) return n(i.finallyLoc);
              } else if (c) {
                if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
              } else {
                if (!u)
                  throw new Error(
                    "try statement without catch or finally",
                  );
                if (this.prev < i.finallyLoc) return n(i.finallyLoc);
              }
            }
          }
        },
        abrupt: function (t, e) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var o = this.tryEntries[n];
            if (
              o.tryLoc <= this.prev &&
              r.call(o, "finallyLoc") &&
              this.prev < o.finallyLoc
            ) {
              var i = o;
              break;
            }
          }
          i &&
            ("break" === t || "continue" === t) &&
            i.tryLoc <= e &&
            e <= i.finallyLoc &&
            (i = null);
          var a = i ? i.completion : {};
          return (
            (a.type = t),
            (a.arg = e),
            i
              ? ((this.method = "next"),
                (this.next = i.finallyLoc),
                l)
              : this.complete(a)
          );
        },
        complete: function (t, e) {
          if ("throw" === t.type) throw t.arg;
          return (
            "break" === t.type || "continue" === t.type
              ? (this.next = t.arg)
              : "return" === t.type
              ? ((this.rval = this.arg = t.arg),
                (this.method = "return"),
                (this.next = "end"))
              : "normal" === t.type && e && (this.next = e),
            l
          );
        },
        finish: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.finallyLoc === t)
              return this.complete(r.completion, r.afterLoc), O(r), l;
          }
        },
        catch: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.tryLoc === t) {
              var n = r.completion;
              if ("throw" === n.type) {
                var o = n.arg;
                O(r);
              }
              return o;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, e, r) {
          return (
            (this.delegate = {
              iterator: S(t),
              resultName: e,
              nextLoc: r,
            }),
            "next" === this.method && (this.arg = void 0),
            l
          );
        },
      }),
      t
    );
  }
  function nt(t, e, r, n, o, i, a) {
    try {
      var c = t[i](a),
        u = c.value;
    } catch (t) {
      return void r(t);
    }
    c.done ? e(u) : Promise.resolve(u).then(n, o);
  }
  function ot(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n);
    }
  }
  function it(t, e, r) {
    return (
      e && ot(t.prototype, e),
      r && ot(t, r),
      Object.defineProperty(t, "prototype", { writable: !1 }),
      t
    );
  }
  function at(t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
      t
    );
  }
  const ct = it(function t() {
    var e = this;
    !(function (t, e) {
      if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function");
    })(this, t),
      at(this, "validateRegistrationData", function (t) {
        return Q()
          .object({
            name: Q().string().min(3).max(64).trim().required(),
            email: Q()
              .string()
              .email()
              .max(128)
              .lowercase()
              .trim()
              .required(),
            password: Q().string().min(6).max(256).required(),
          })
          .validate(t);
      }),
      at(
        this,
        "register",
        (function () {
          var t,
            r =
              ((t = rt().mark(function t(r, n) {
                var o, i, a, c, u, s;
                return rt().wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (
                            ((o = r.body),
                            (i = e.validateRegistrationData(o).error))
                          ) {
                            t.next = 16;
                            break;
                          }
                          return (
                            (t.prev = 3),
                            (t.next = 6),
                            e.authService.register(o)
                          );
                        case 6:
                          return (
                            (a = t.sent),
                            t.abrupt(
                              "return",
                              n
                                .status(201)
                                .json({
                                  error: null,
                                  data: { userId: a },
                                }),
                            )
                          );
                        case 10:
                          return (
                            (t.prev = 10),
                            (t.t0 = t.catch(3)),
                            (c = t.t0),
                            (u = c.error),
                            (s = c.code),
                            t.abrupt(
                              "return",
                              n
                                .status(+s)
                                .json({ error: u, data: null }),
                            )
                          );
                        case 14:
                          t.next = 17;
                          break;
                        case 16:
                          return t.abrupt(
                            "return",
                            n
                              .status(403)
                              .json({ error: i.message, data: null }),
                          );
                        case 17:
                        case "end":
                          return t.stop();
                      }
                  },
                  t,
                  null,
                  [[3, 10]],
                );
              })),
              function () {
                var e = this,
                  r = arguments;
                return new Promise(function (n, o) {
                  var i = t.apply(e, r);
                  function a(t) {
                    nt(i, n, o, a, c, "next", t);
                  }
                  function c(t) {
                    nt(i, n, o, a, c, "throw", t);
                  }
                  a(void 0);
                });
              });
          return function (t, e) {
            return r.apply(this, arguments);
          };
        })(),
      ),
      (this.authService = new tt());
  });
  function ut(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n);
    }
  }
  function st(t, e, r) {
    return (
      e && ut(t.prototype, e),
      r && ut(t, r),
      Object.defineProperty(t, "prototype", { writable: !1 }),
      t
    );
  }
  function lt(t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
      t
    );
  }
  const ft = st(function t() {
    var r = this;
    !(function (t, e) {
      if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function");
    })(this, t),
      lt(this, "path", "/"),
      lt(this, "initializeRoute", function () {
        r.router.get("".concat(r.path), function (t, e) {
          e.status(200).json({
            error: null,
            data: "User auth route - healthy",
          });
        }),
          r.router.post(
            "".concat(r.path, "register"),
            function (t, e) {
              r.authController.register(t, e);
            },
          );
      }),
      (this.router = (0, e.Router)()),
      (this.authController = new ct()),
      this.initializeRoute();
  });
  function ht(t, e) {
    var r = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(t);
      e &&
        (n = n.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        r.push.apply(r, n);
    }
    return r;
  }
  function pt(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? ht(Object(r), !0).forEach(function (e) {
            yt(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(
            t,
            Object.getOwnPropertyDescriptors(r),
          )
        : ht(Object(r)).forEach(function (e) {
            Object.defineProperty(
              t,
              e,
              Object.getOwnPropertyDescriptor(r, e),
            );
          });
    }
    return t;
  }
  function vt(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n);
    }
  }
  function dt(t, e, r) {
    return (
      e && vt(t.prototype, e),
      r && vt(t, r),
      Object.defineProperty(t, "prototype", { writable: !1 }),
      t
    );
  }
  function yt(t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
      t
    );
  }
  new (dt(function t() {
    var e = this;
    !(function (t, e) {
      if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function");
    })(this, t),
      yt(
        this,
        "logPath",
        u().join(__dirname, "..", "logs", "access.log"),
      ),
      yt(this, "listen", function () {
        e.app.listen(e.port, function () {
          console.log("Server is up on the port: ".concat(e.port));
        });
      }),
      yt(this, "initializeMiddlewares", function () {
        e.app.use(o()()), e.app.use(r().json()), e.app.use(a()());
      }),
      yt(this, "initializeRoutes", function () {
        e.app.use("/auth", e.userAuthRoute.router);
      }),
      yt(this, "handleMiscRoutes", function () {
        e.app.get("/", function (t, e) {
          e.status(200).json({
            error: null,
            data: { server: "Base-Healthy" },
          });
        }),
          e.app.all("*", function (t, e) {
            e.status(404).json({
              error: "Requested route doesn't exist - 404",
              data: null,
            });
          });
      }),
      yt(this, "configureExpressSessionMiddleware", function () {
        e.app.use(l()(pt(pt({}, q), {}, { store: e.redisStore })));
      }),
      (this.app = r()()),
      (this.port = +I || 4e3),
      (this.redisStore = new U().redisStore),
      (this.userAuthRoute = new ft()),
      this.initializeMiddlewares(),
      this.initializeRoutes(),
      this.handleMiscRoutes(),
      this.configureExpressSessionMiddleware();
  }))().listen();
})();
//# sourceMappingURL=index.js.map
