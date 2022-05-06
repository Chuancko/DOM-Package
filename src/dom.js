window.dom = {
    // 增
    create(string) {
        //template标签不会在页面中显示，并且可以容纳所有标签
        const container = document.createElement('template');
        //trim()会从一个字符串的两端删除空白字符
        container.innerHTML = string.trim();
        return container.content.firstChild;
    },
    after(node,node2){
        node.parentNode.insertBefore(node2,node.nextSibling)
        // node.after(node2);
    },
    before(node,node2){
        node.parentNode.insertBefore(node2,node);
    },
    append(parent,node){
        parent.appendChild(node);
    },
    wrap(node,parent){
        dom.before(node,parent); //把新节点插入到将被包裹节点的前面
        dom.append(parent,node); //将 将被包裹节点插入到新节点里成为子节点
    },

    // 删
    remove(node){
        node.parentNode.removeChild(node);
        return node // 删除整个节点
    },
    empty(node){
        /* v1 
        node.innerHTML = '';
        这种方法也可以，但是没有办法获得删除节点的引用
        */

        /* v2
        const ({childNodes} = node 相等 childNodes = node.childNodes)
        const array = [];
        for(let i=0; i<childNodes.length; i++){
            dom.remove(childNodes[i])
            array.push(childNodes[i])
        }
        remove之后，childNodes.length是时时改变的，有bug
        */
        const array = [];
        let x = node.firstChild;
        while(x){
            array.push(dom.remove(node.firstChild));
            x = node.firstChild;
        }
        return array //返回被删除的节点子代
    },

    // 改
    attr(node,name,value){ //重载
        if(arguments.length === 3){
            node.setAttribute(name,value)
        }else if(arguments.length === 2){
            return node.getAttribute(name)
        }
    },
    text(node,string){ //适配
        if(arguments.length === 2){
            if('innerText' in node){
                node.innerText = string;
            }else{
                node.textContent = string;
            }
        }else if(arguments.length === 1){
            if('innerText' in node){
                return node.innerText
            }else{
                return node.textContent
            }
        }
    },
    html(node,string){
        if(arguments.length === 2){
            node.innerHTML = string;
        }else if(arguments.length === 1){
            return node.innerHTML
        }
    },
    style(node,name,value){
        if(arguments.length === 3){
            //dom.style(div,'color','blue')
            node.style[name] = value
        }else if(arguments.length === 2){
            //typeof用来检测一个对象是否已经被定义或者被赋值
            if(typeof name === 'string'){ 
                //dom.style(div,'color')
                return node.style[name]
            //instanceof用来比较两个操作数的构造函数
            }else if(name instanceof Object){
                //dom.style(div,{})
                for(let key in name){
                node.style[key] = name[key]
                }
            }
        }
    },
    class:{
        add(node,className){
            node.classList.add(className)
        },
        remove(node,className){
            node.classList.remove(className)
        },
        has(node,className){
            return node.classList.contains(className)
        }
    },
    on(node,eventName,fn){
        node.addEventListener(eventName,fn)
    },
    off(node,eventName,fn){
        node.removeEventListener(eventName,fn)
    },

    //查
    find(selector,scope){
        return (scope || document).querySelectorAll(selector)
    },
    parent(node){
        return node.parentNode
    },
    children(node){
        return node.children
    },
    siblings(node){
        return Array.from(node.parentNode.children).filter(n=>n!==node)
    },
    next(node){
        let x = node.nextSibling
        while(x && x.nodeType === 3){
            x = x.nextSibling
        }
        return x
    },
    previous(node){
        let x = node.previousSibling
        while(x && x.nodeType === 3){
            x = x.previousSibling
        }
        return x
    },
    each(nodeList,fn){
        for(let i =0; i< nodeList.length; i++){
            fn.call(null,nodeList[i])
        }
    },
    index(node){
        const list = dom.children(node.parentNode)
        let i = 0
        for(i =0;i <list.length; i++){
            if(list[i] === node){
                break
            }
        }
        return i
    }

};
