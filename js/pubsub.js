let subscribers = {};
function subscribe(s, r) {
  return (
    void 0 === subscribers[s] && (subscribers[s] = []),
    (subscribers[s] = [...subscribers[s], r]),
    function () {
      subscribers[s] = subscribers[s].filter((s) => s !== r);
    }
  );
}
function publish(s, r) {
  subscribers[s] &&
    subscribers[s].forEach((s) => {
      s(r);
    });
}
