# metadata upload to cid
A tool to give a user the ability to upload a csv containing a list of metadata {fileName,name,description} which pairs to web3.storage upload placing the desired metadata in a directory for use with ERC721 / ERC1155.

[example](https://bafybeihcjuqoj4ycckax7j2myth4dpizrgjfez4t4qba7saitij52ib3re.ipfs.nftstorage.link/)

## to run
1. input web3.storage api key on `line 11` of `App.tsx`
2. `$ yarn`
3. `$ yarn dev`

## tests
- [x] check for mismatch in e.target.files
- [x] check that csv doesn't contain commas, and 3 columns
- [x] check if image is png / jpg
