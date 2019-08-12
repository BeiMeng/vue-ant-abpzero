/**
 * @author 刘鹏飞1
 * @email creatworld2013@live.com
 * @create date 2018-02-27 05:20:47
 * @modify date 2018-02-27 05:20:47
 * @desc [description]
 */
const insertMode = {
  afterbegin: 'afterbegin',
  beforeend: 'beforeend',
  beforebegin: 'beforebegin',
  afterend: 'afterend'
};

export default void (function() {
  Window.prototype.select = function(query) {
    return document.querySelector(query);
  };

  Window.prototype.selectAll = function(query) {
    return document.querySelectorAll(query);
  };

  Window.prototype.byId = function(query) {
    return document.getElementById(query);
  };

  Window.prototype.byClass = function(query) {
    return document.getElementsByClassName(query);
  };

  Window.prototype.byTag = function(query) {
    return document.getElementsByTagName(query);
  };

  Window.prototype.remove = function(query) {
    let eles = selectAll(query);

    for (let ele of eles) {
      if (ele && ele.parentNode) {
        ele.parentNode.removeChild(ele);
      }
    }
  };

  Element.prototype.select = function(query) {
    return this.querySelector(query);
  };

  Element.prototype.selectAll = function(query) {
    return this.querySelectorAll(query);
  };

  Element.prototype.text = function(text) {
    if (isValue(text)) {
      this.textContent = text;
      return this;
    } else {
      return this.textContent;
    }
  };

  Element.prototype.html = function(html) {
    if (isValue(html)) {
      this.innerHTML = html;
      return this;
    } else {
      return this.innerHTML;
    }
  };

  Element.prototype.val = function(val) {
    let el = this.querySelector('select');
    if (isValue(el)) {
      if (isValue(val)) {
        let index = -1;
        for (let i = 0; i < el.options.length; i++) {
          if (el.options[i].value == val) {
            index = i;
            break;
          }
        }
        el.selectedIndex = index;
        return this;
      } else {
        return el.options[el.selectedIndex].value;
      }
    }

    el = this.querySelector('input');

    if (isValue(el)) {
      if (isValue(val)) {
        el.value = val;
        return this;
      } else {
        return el.value;
      }
    }

    el = this.querySelector('textarea');
    if (isValue(el)) {
      if (isValue(val)) {
        el.value = val;
        return this;
      } else {
        return el.value;
      }
    }
  };

  Element.prototype.attr = function(name, value) {
    if (isValue(value)) {
      this.setAttribute(name, value);
      if (value === '') {
        this.removeAttribute(name);
      }
      return this;
    } else {
      return this.getAttribute(name);
    }
  };

  Element.prototype.css = function(name, value) {
    //传入css对象
    if (!isValue(value) && typeof name === 'object') {
      for (let key of Object.keys(name)) {
        this.style && (this.style.cssText += `${key}:${name[key]}`);
      }
      return this;
    } else if (
      !isValue(value) &&
      typeof name === 'string' &&
      name.indexOf(':') > 0
    ) {
      //传入css字符串
      this.style && (this.style.cssText += ';' + name);
      return this;
    } else if (isValue(value)) {
      //传入name+value
      this.style && (this.style.cssText += `${name}:${value}`);
      return this;
    } else {
      var complutedStyle = window.getComputedStyle(this, null);
      return complutedStyle.getPropertyValue(name);
    }
  };

  Element.prototype.clearCss = function(name) {
    if (!isValue(name)) {
      this.style.cssText = '';
    } else {
      let css = '';
      let cssArray = this.style.cssText.splite(';');
      for (let item of cssArray) {
        if (!item.contains(name)) {
          css += item + ';';
        }
      }
      this.style.cssText = css;
    }
    return this;
  };

  Element.prototype.append = function(ele) {
    //传入html字符串
    if (typeof ele === 'string') {
      this.insertAdjacentHTML(insertMode.beforeend, ele);
    } else {
      this.insertAdjacentElement(insertMode.beforeend, ele);
    }
    return this;
  };

  Element.prototype.prepend = function(ele) {
    //传入html字符串
    if (typeof ele === 'string') {
      this.insertAdjacentHTML(insertMode.afterbegin, ele);
    } else {
      this.insertAdjacentElement(insertMode.afterbegin, ele);
    }
    return this;
  };

  Element.prototype.after = function(ele) {
    //传入html字符串
    if (typeof ele === 'string') {
      this.insertAdjacentHTML(insertMode.afterend, ele);
    } else {
      this.insertAdjacentElement(insertMode.afterend, ele);
    }
    return this;
  };

  Element.prototype.before = function(ele) {
    //传入html字符串
    if (typeof ele === 'string') {
      this.insertAdjacentHTML(insertMode.beforebegin, ele);
    } else {
      this.insertAdjacentElement(insertMode.beforebegin, ele);
    }
    return this;
  };

  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };

  Element.prototype.empty = function() {
    this.html('');
    return this;
  };

  Element.prototype.addClass = function(cls) {
    if ('classList' in this) {
      if (isArray(cls)) {
        for (let c of cls) {
          if (isValue(c) && c != '') this.classList.add(c);
        }
      } else {
        if (isValue(cls) && cls != '') this.classList.add(cls);
      }
    } else {
      if (isArray(cls)) {
        for (let c of cls) {
          this.className += ` ${c}`;
        }
      } else {
        this.className += ` ${cls}`;
      }
    }
    return this;
  };

  Element.prototype.removeClass = function(cls) {
    if ('classList' in this) {
      if (isArray(cls)) {
        for (let c of cls) {
          if (isValue(c) && c != '') this.classList.remove(c);
        }
      } else {
        if (isValue(cls) && cls != '') this.classList.remove(cls);
      }
    } else {
      if (isArray(cls)) {
        for (let c of cls) {
          this.className = this.className.replace(c, '');
        }
      } else {
        this.className = this.className.replace(cls, '');
      }
    }
    return this;
  };

  Element.prototype.hasClass = function(cls) {
    return this.className.indexOf(cls) > -1;
  };

  Element.prototype.toggleClass = function(cls) {
    if ('classList' in this) {
      if (isArray(cls)) {
        for (let c of cls) {
          if (isValue(c) && c != '') this.classList.toggle(c);
        }
      } else {
        if (isValue(cls) && cls != '') this.classList.toggle(cls);
      }
    } else {
      if (isArray(cls)) {
        for (let c of cls) {
          if (this.hasClass(c)) {
            this.removeClass(c);
          } else {
            this.addClass(c);
          }
        }
      } else {
        if (this.hasClass(cls)) {
          this.removeClass(cls);
        } else {
          this.addClass(cls);
        }
      }
    }
    return this;
  };

  Element.prototype.replaceClass = function(oldCls, newCls) {
    this.removeClass(oldCls);
    this.addClass(newCls);
    return this;
  };

  Element.prototype.clearClass = function() {
    this.className = '';
    return this;
  };

  Element.prototype.offset = function() {
    let sl = Math.max(
      document.documentElement.scrollLeft,
      document.body.scrollLeft
    );
    var st = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );

    var rect = this.getBoundingClientRect();
    return {
      left: rect.left + sl,
      top: rect.top + st,
      width: this.offsetWidth,
      height: this.offsetHeight
    };
  };
})();
