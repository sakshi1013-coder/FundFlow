(function(global){
  function normalize(str){
    if (str == null) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // strip accents
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buildIndex(items, keyFn){
    const index = items.map(item => ({
      key: normalize(keyFn(item)),
      id: item.id
    })).sort((a,b) => a.key < b.key ? 1 * -1 : a.key > b.key ? 1 : (a.id < b.id ? -1 : 1));
    return index;
  }

  function lowerBound(index, prefix){
    let lo = 0, hi = index.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (index[mid].key < prefix) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  function upperBound(index, prefix){
    // All strings that start with prefix are <= prefix + \uffff
    const hiKey = prefix + '\\uffff';
    let lo = 0, hi = index.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (index[mid].key <= hiKey) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  function searchPrefix(index, term){
    const p = normalize(term);
    if (!p) return [];
    const start = lowerBound(index, p);
    const end = upperBound(index, p);
    const result = [];
    for (let i=start; i<end; i++) {
      if (index[i].key.startsWith(p)) result.push(index[i].id);
      else break; // safety if ordering differs
    }
    return result;
  }

  function unionIds(){
    const seen = new Set();
    for (const arr of arguments){
      for (const id of arr){ seen.add(id); }
    }
    return Array.from(seen);
  }

  global.SearchUtils = { normalize, buildIndex, searchPrefix, unionIds };
})(window);





// #include <iostream>
// using namespace std;

// // -------- Normalize Function --------
// // Converts string to lowercase, keeps only letters/numbers, replaces others with space
// string normalize(const string &str) {
//     string result = "";
//     for (int i = 0; str[i] != '\0'; i++) {
//         char c = str[i];
//         if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
//             if (c >= 'A' && c <= 'Z') c = c + ('a' - 'A'); // lowercase
//             result += c;
//         } else {
//             result += ' '; // replace symbol with space
//         }
//     }

//     // remove extra spaces
//     string finalStr = "";
//     bool space = false;
//     for (int i = 0; result[i] != '\0'; i++) {
//         if (result[i] != ' ') {
//             finalStr += result[i];
//             space = false;
//         } else if (!space) { // first space
//             finalStr += ' ';
//             space = true;
//         }
//     }

//     // remove trailing space
//     if (finalStr.length() > 0 && finalStr[finalStr.length() - 1] == ' ')
//         finalStr = finalStr.substr(0, finalStr.length() - 1);

//     return finalStr;
// }

// // -------- Entry Struct --------
// struct Entry {
//     string key;
//     int id;
// };

// // -------- Sort Entries --------
// void sortEntries(Entry index[], int n) {
//     for (int i = 0; i < n - 1; i++) {
//         for (int j = i + 1; j < n; j++) {
//             if (index[i].key > index[j].key || (index[i].key == index[j].key && index[i].id > index[j].id)) {
//                 Entry temp = index[i];
//                 index[i] = index[j];
//                 index[j] = temp;
//             }
//         }
//     }
// }

// // -------- Build Index --------
// void buildIndex(Entry index[], pair<int,string> items[], int n) {
//     for (int i = 0; i < n; i++) {
//         index[i].key = normalize(items[i].second);
//         index[i].id = items[i].first;
//     }
//     sortEntries(index, n);
// }

// // -------- Lower Bound --------
// int lowerBound(Entry index[], int n, string prefix) {
//     int lo = 0, hi = n;
//     while (lo < hi) {
//         int mid = (lo + hi) / 2;
//         if (index[mid].key < prefix) lo = mid + 1;
//         else hi = mid;
//     }
//     return lo;
// }

// // -------- Upper Bound --------
// int upperBound(Entry index[], int n, string prefix) {
//     string hiKey = prefix + char(127); // simulate \uffff
//     int lo = 0, hi = n;
//     while (lo < hi) {
//         int mid = (lo + hi) / 2;
//         if (index[mid].key <= hiKey) lo = mid + 1;
//         else hi = mid;
//     }
//     return lo;
// }

// // -------- Search Prefix --------
// int searchPrefix(Entry index[], int n, string term, int result[]) {
//     string p = normalize(term);
//     if (p == "") return 0;

//     int start = lowerBound(index, n, p);
//     int end = upperBound(index, n, p);

//     int count = 0;
//     for (int i = start; i < end; i++) {
//         // check if starts with prefix
//         bool match = true;
//         for (int j = 0; j < p.length(); j++) {
//             if (index[i].key[j] != p[j]) {
//                 match = false;
//                 break;
//             }
//         }
//         if (match) result[count++] = index[i].id;
//         else break;
//     }
//     return count;
// }

// // -------- Union of IDs --------
// int unionIds(int arr1[], int n1, int arr2[], int n2, int result[]) {
//     int k = 0;
//     // copy arr1
//     for (int i = 0; i < n1; i++) result[k++] = arr1[i];
//     // copy arr2 if not already in result
//     for (int i = 0; i < n2; i++) {
//         bool found = false;
//         for (int j = 0; j < k; j++) {
//             if (arr2[i] == result[j]) {
//                 found = true;
//                 break;
//             }
//         }
//         if (!found) result[k++] = arr2[i];
//     }
//     return k;
// }

// // -------- Main --------
// int main() {
//     const int N = 5;
//     pair<int,string> items[N] = {
//         {1, "Apple"},
//         {2, "Application"},
//         {3, "Banana"},
//         {4, "Apricot"},
//         {5, "App Store"}
//     };

//     Entry index[N];
//     buildIndex(index, items, N);

//     int result[10];
//     int count = searchPrefix(index, N, "app", result);

//     cout << "Results for prefix 'app': ";
//     for (int i = 0; i < count; i++) cout << result[i] << " ";
//     cout << "\n";

//     // Union example
//     int arr1[2] = {1, 2};
//     int arr2[3] = {2, 3, 4};
//     int uni[10];
//     int uCount = unionIds(arr1, 2, arr2, 3, uni);

//     cout << "Union: ";
//     for (int i = 0; i < uCount; i++) cout << uni[i] << " ";
//     cout << "\n";

//     return 0;
// }
