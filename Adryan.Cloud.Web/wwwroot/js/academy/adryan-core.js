window.ADRYAN = window.ADRYAN || {};

ADRYAN.Storage = {
    data: {},
    get: function(key) {
        try { return localStorage.getItem(key); }
        catch(e) { return this.data[key] || null; }
    },
    set: function(key, val) {
        try { localStorage.setItem(key, val); }
        catch(e) { this.data[key] = val; }
    }
};