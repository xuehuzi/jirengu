function fn(){
    console.log(22222)
    const element = document.createElement('div');
    element.innerHTML = '我是模块一js插的一个DIV';
    element.classList.add('mydiv');
    document.body.appendChild(element);
  }
  
  export default fn