import DataList from "./Item.js";

export default {
    data() {
        return {
            title: document.title,
            col1: "Name",
            col2: "URL",
            col3: "Password",
            col4: "",
        };
    },
    components: {
        DataList,
    },
    template: `
        <div class="container-fluid">
            <div class="row text-center">
                <div class="col py-3">
                    <span class="h3 fw-normal">{ col1 }</span>
                </div>
                <div class="col py-3">
                    <span class="h3 fw-normal">{ col2 }</span>
                </div>
                <div class="col py-3">
                    <span class="h3 fw-normal">{ col3 }</span>
                </div>
                <div class="col-auto">{ col4 }</div>
            </div>
            <Item />
        </div>`,
};
