export default function voidAsyncWrapper(promise: (...args: any[]) => Promise<any>) {
    return (...args: any[]) => {
        promise(...args)
            .then()
            .catch(err => {
                console.error(err)
            })
    }
}
