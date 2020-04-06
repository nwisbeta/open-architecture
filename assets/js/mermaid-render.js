//requires https://cdnjs.cloudflare.com/ajax/libs/mermaid/8.0.0/mermaid.min.js

(function(){

    const mermaids = Array.from(document.querySelectorAll(".language-mermaid"));

    for(i=0; i < mermaids.length; i++){       
            
            let svgElement = convertMermaidToSvgElement("mermaid-" + i, mermaids[i].innerText);

            svgElement.removeAttribute("height");

            let preElement = mermaids[i].parentElement;

            preElement.parentNode.replaceChild(svgElement, preElement);
    }

    function convertMermaidToSvgElement(id, code){
            let svg;            
            mermaid.render(id, code, output => { svg = output });        
            let template = document.createElement("template");  
            template.innerHTML = svg;            
            return template.content.firstChild;
    }

})();