!(function () {
  var e = (function () {
    function e(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    return function (t, n, r) {
      return n && e(t.prototype, n), r && e(t, r), t;
    };
  })();
  !(function (e) {
    var t = { exports: {} };
    e.call(t.exports, t, t.exports);
  })(function (t, n) {
    "use strict";
    function r(e, t) {
      if (e.length != t.length)
        throw Error("Payload body and response have different number of items");
      e.forEach(function (e, n) {
        var r = 1;
        try {
          r = parseInt(t[n].quantity, 10) || 1;
        } catch (e) {
          console &&
            console.warn &&
            console.warn(
              "[shop_events_listener] Error in handleBulkItemCartAddResponse: " +
                e.message
            );
        }
        o(e, r);
      });
    }
    function a(e) {
      if (!e) return 1;
      try {
        return JSON.parse(e).quantity || 1;
      } catch (a) {
        if (e instanceof FormData) {
          if (e.has("quantity")) return e.get("quantity");
        } else
          for (var t = e.split("&"), n = 0; n < t.length; n++) {
            var r = t[n].split("=");
            if ("quantity" === r[0]) return r[1];
          }
      }
      return 1;
    }
    function o(e, t) {
      var n = s("cart"),
        r = c(
          {
            variantId: String(e.id),
            productId: e.product_id,
            currency: window.ShopifyAnalytics.meta.currency,
            quantity: String(t || 1),
            price: e.price / 100,
            name: e.title,
            sku: e.sku,
            brand: e.vendor,
            variant: e.variant_title,
            category: e.product_type,
          },
          i()
        ),
        a = c({ cartToken: n }, r);
      window.ShopifyAnalytics.lib.track("Added Product", a);
      var o = c({ referer: window.location.href }, r);
      window.ShopifyAnalytics.lib.track(
        "monorail://trekkie_storefront_track_added_product/1.1",
        o
      );
    }
    function i() {
      var e = {};
      return (
        window.ShopifyAnalytics.meta.page &&
          (e = {
            pageType: window.ShopifyAnalytics.meta.page.pageType,
            resourceType: window.ShopifyAnalytics.meta.page.resourceType,
            resourceId: window.ShopifyAnalytics.meta.page.resourceId,
          }),
        e
      );
    }
    function c(e, t) {
      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
      return e;
    }
    function s(e) {
      try {
        var t = new RegExp("(" + e + ")=([^;]+)").exec(document.cookie);
        return t ? unescape(t[2]) : null;
      } catch (e) {
        return null;
      }
    }
    Object.defineProperty(n, "__esModule", { value: !0 });
    var d,
      u,
      l,
      y = (function () {
        function t(e, n, r, a) {
          (function (e, t) {
            if (!(e instanceof t))
              throw new TypeError("Cannot call a class as a function");
          })(this, t),
            (this.xhr = e),
            (this.url = n),
            (this.method = r),
            (this.body = a);
        }
        return (
          e(t, null, [{ key: "handleXhrOpen", value: function () {} }]),
          e(
            t,
            [
              {
                key: "onReadyStateChange",
                value: function () {
                  this.xhr.readyState === XMLHttpRequest.DONE &&
                    t.handleXhrDone({
                      method: this.method,
                      url: this.url,
                      body: this.body,
                      xhr: this.xhr,
                    }),
                    this.oldOnReadyStateChange && this.oldOnReadyStateChange();
                },
              },
            ],
            [
              {
                key: "handleXhrDone",
                value: function (e) {
                  try {
                    var n = document.createElement("a");
                    n.href = e.url;
                    var i = n.pathname ? n.pathname : e.url;
                    t.ADD_TO_CART_REGEX.test(i) &&
                      t._parsePayloadResponse(e, function (t) {
                        var n = Object.keys(t);
                        if (1 === n.length && "items" === n[0]) {
                          var i = t.items,
                            c = void 0;
                          try {
                            c = JSON.parse(e.body).items;
                          } catch (t) {
                            c = (function (e, t) {
                              for (var n = new Array(t), r = 0; r < t; r++)
                                n[r] = {};
                              var a = !0,
                                o = !1,
                                i = void 0;
                              try {
                                for (
                                  var c,
                                    s = decodeURI(e)
                                      .split("&")
                                      [Symbol.iterator]();
                                  !(a = (c = s.next()).done);
                                  a = !0
                                ) {
                                  var d = c.value.split("="),
                                    u = d[0].match(/items\[(\d+)\]\[(\w+)\].*/);
                                  if (u) {
                                    var l = u[1],
                                      y = u[2];
                                    "quantity" === y
                                      ? (n[l].quantity = d[1])
                                      : "id" === y && (n[l].id = d[1]);
                                  }
                                }
                              } catch (e) {
                                (o = !0), (i = e);
                              } finally {
                                try {
                                  !a && s.return && s.return();
                                } finally {
                                  if (o) throw i;
                                }
                              }
                              return n;
                            })(e.body, i.length);
                          }
                          r(i, c);
                        } else o(t, a(e.body));
                      });
                  } catch (e) {
                    console &&
                      console.warn &&
                      console.warn(
                        "[shop_events_listener] Error in handleXhrDone:  " +
                          e.message
                      );
                  }
                },
              },
              {
                key: "parseBlobToJson",
                value: function (e, t) {
                  var n = new FileReader();
                  n.addEventListener("loadend", function () {
                    return t(
                      JSON.parse(
                        String.fromCharCode.apply(
                          String,
                          (function (e) {
                            if (Array.isArray(e)) {
                              for (
                                var t = 0, n = Array(e.length);
                                t < e.length;
                                t++
                              )
                                n[t] = e[t];
                              return n;
                            }
                            return Array.from(e);
                          })(new Uint8Array(n.result))
                        )
                      )
                    );
                  }),
                    n.readAsArrayBuffer(e);
                },
              },
              {
                key: "_parsePayloadResponse",
                value: function (e, n) {
                  e.xhr.response instanceof Blob
                    ? t.parseBlobToJson(e.xhr.response, n)
                    : e.xhr.responseText && n(JSON.parse(e.xhr.responseText));
                },
              },
            ]
          ),
          t
        );
      })();
    (y.ADD_TO_CART_REGEX =
      /^(?:\/[a-zA-Z]+(?:\-[a-zA-Z]+)?)?\/cart\/add(?:\.js|\.json)?$/),
      (n.default = y),
      (function () {
        function e(e, t, n) {
          window.jQuery && window.jQuery(e).bind
            ? window.jQuery(e).bind(t, n)
            : e.addEventListener
            ? e.addEventListener(t, n)
            : e.attachEvent && e.attachEvent("on" + t, n);
        }
        function t(e) {
          if (
            !(
              (e = e || window.event).defaultPrevented ||
              (e.isDefaultPrevented && e.isDefaultPrevented())
            )
          ) {
            var t = e.target || e.srcElement;
            if (t && (t.getAttribute("action") || t.getAttribute("href")))
              try {
                var n,
                  r = t.id || t.elements.id;
                n = r.options ? r.options[r.selectedIndex] : r;
                var a = s("cart"),
                  i = o(n.value);
                i.quantity = String(t.quantity ? t.quantity.value : 1);
                var d = c({ cartToken: a }, i),
                  u = c({ referer: window.location.href }, i);
                window.ShopifyAnalytics.lib.track("Added Product", d),
                  window.ShopifyAnalytics.lib.track(
                    "monorail://trekkie_storefront_track_added_product/1.1",
                    u
                  );
              } catch (e) {
                console &&
                  console.warn &&
                  console.warn(
                    "[shop_events_listener] Error in handleSubmitCartAdd: " +
                      e.message
                  );
              }
          }
        }
        function n(e) {
          var t = (e = e || window.event).target || e.srcElement;
          if (
            t &&
            t.getAttribute("action") &&
            null !== t.getAttribute("data-payment-form")
          )
            try {
              window.ShopifyAnalytics.lib.track("Added Payment", {
                currency: window.ShopifyAnalytics.meta.currency,
                total: window.ShopifyAnalytics.meta.checkout.payment_due / 100,
              });
            } catch (e) {
              console &&
                console.warn &&
                console.warn(
                  "[shop_events_listener] Error in handleSubmitToPaymentAdd: " +
                    e.message
                );
            }
        }
        function r(e) {
          a((e = e || window.event).currentTarget);
        }
        function a(e) {
          try {
            var t,
              n = e.id || e.elements.id;
            if (
              !(t =
                n.options && n.options[n.selectedIndex]
                  ? n.options[n.selectedIndex]
                  : n)
            )
              return;
            var r = t.value;
            if (
              window.ShopifyAnalytics.meta.selectedVariantId &&
              window.ShopifyAnalytics.meta.selectedVariantId == r
            )
              return;
            var a = o((window.ShopifyAnalytics.meta.selectedVariantId = r));
            window.ShopifyAnalytics.lib.track("Viewed Product Variant", a);
          } catch (e) {
            console &&
              console.warn &&
              console.warn(
                "[shop_events_listener] Error in trackViewedProductVariant: " +
                  e.message
              );
          }
        }
        function o(e) {
          var t = c(
            (function (e) {
              var t = void 0,
                n = void 0,
                r = void 0;
              if (window.ShopifyAnalytics.meta.products) {
                var a = (function (e, t) {
                  var n = !0,
                    r = !1,
                    a = void 0;
                  try {
                    for (
                      var o, i = t[Symbol.iterator]();
                      !(n = (o = i.next()).done);
                      n = !0
                    ) {
                      var c = o.value,
                        s = d(e, c);
                      if (s) return { product: c, variant: s };
                    }
                  } catch (e) {
                    (r = !0), (a = e);
                  } finally {
                    try {
                      !n && i.return && i.return();
                    } finally {
                      if (r) throw a;
                    }
                  }
                })(e, window.ShopifyAnalytics.meta.products);
                (t = a.product), (n = a.variant);
              } else
                window.ShopifyAnalytics.meta.product &&
                  (n = d(e, (t = window.ShopifyAnalytics.meta.product)));
              return (
                t
                  ? ((r = {
                      productId: t.id,
                      productGid: t.gid,
                      brand: t.vendor,
                      category: t.type,
                    }),
                    n &&
                      (r = c(r, {
                        variantId: e,
                        price: n.price / 100,
                        name: n.name,
                        sku: n.sku,
                        variant: n.public_title,
                      })))
                  : (r = { variantId: e }),
                r
              );
            })(e),
            i()
          );
          return (t.currency = window.ShopifyAnalytics.meta.currency), t;
        }
        function d(e, t) {
          var n = !0,
            r = !1,
            a = void 0;
          try {
            for (
              var o, i = t.variants[Symbol.iterator]();
              !(n = (o = i.next()).done);
              n = !0
            ) {
              var c = o.value;
              if (c.id == e) return c;
            }
          } catch (e) {
            (r = !0), (a = e);
          } finally {
            try {
              !n && i.return && i.return();
            } finally {
              if (r) throw a;
            }
          }
        }
        e(window, "load", function () {
          for (var o = 0; o < document.forms.length; o++) {
            var i = document.forms[o].getAttribute("action");
            i &&
              0 <= i.indexOf("/cart/add") &&
              (e(document.forms[o], "submit", t),
              e(document.forms[o], "change", r),
              a(document.forms[o]));
            var c = document.forms[o].elements.previous_step;
            c && "payment_method" === c.value && e(document.body, "submit", n);
          }
        });
      })(),
      (d = XMLHttpRequest),
      (u = d.prototype.open),
      (l = d.prototype.send),
      (d.prototype.open = function (e, t) {
        (this._url = t),
          (this._method = e),
          y.handleXhrOpen(),
          u.apply(this, arguments);
      }),
      (d.prototype.send = function (e) {
        var t = new y(this, this._url, this._method, e);
        this.addEventListener
          ? this.addEventListener(
              "readystatechange",
              t.onReadyStateChange.bind(t),
              !1
            )
          : ((t.oldOnReadyStateChange = this.onreadystatechange),
            (this.onreadystatechange = t.onReadyStateChange)),
          l.call(this, e);
      }),
      (function (e, t) {
        function n(e, t) {
          e.clone()
            .json()
            .then(function (e) {
              var n = t.items;
              return r(e.items, n), e;
            })
            .catch(c);
        }
        function i(e, t) {
          var n = a(t);
          e.clone()
            .json()
            .then(function (e) {
              return o(e, n);
            })
            .catch(c);
        }
        function c(e) {
          console &&
            console.warn &&
            console.warn(
              "[shop_events_listener] Error in handleFetchRequest:  " +
                e.message
            );
        }
        "function" == typeof t &&
          (e.fetch = function () {
            var e = arguments;
            return t
              .apply(this, Array.prototype.slice.call(arguments))
              .then(function (t) {
                if (!t.ok) return t;
                var r = document.createElement("a");
                r.href = t.url;
                var a = r.pathname ? r.pathname : t.url;
                try {
                  if (y.ADD_TO_CART_REGEX.test(a)) {
                    try {
                      var o = JSON.parse(e[1].body);
                      if (Object.keys(o).includes("items")) return n(t, o), t;
                    } catch (e) {}
                    i(t, e[1].body);
                  }
                } catch (e) {
                  c(e);
                }
                return t;
              });
          });
      })(window, window.fetch);
  });
})(
  "undefined" != typeof global ? global : "undefined" != typeof window && window
);
