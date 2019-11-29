export class Converter {
    constructor(params) {
        this.params = params;
    }

    result;
    header;

    get result () {
        return this.result;
    }

    get isHeaderAdd() {
        return !!this.header;
    }
    
    setHeader(headerString) {
        this.header = headerString.split(',');
        if (this.params.ignoreColl) {
            const indexIgnoreColl = this.header.findIndex(item => item.search(this.params.ignoreColl) >= 0);
            this.params.indexIgnoreColl = indexIgnoreColl;
            this.header.splice(indexIgnoreColl, 1);
        }
    }

    convert(data, callback) {
        if (this.isHeaderAdd && data) {
            const { indexIgnoreColl } = this.params;
            const parsedData = data.split(',');
            
            if (indexIgnoreColl) {
                parsedData.splice(indexIgnoreColl, 1);
            }

            this.result = parsedData.reduce((calculate, item, index) => {
                return {
                    ...calculate,
                    [this.header[index]]: item
                }
            }, {});

            callback(JSON.stringify(this.result));
        }
    }
}
