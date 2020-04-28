export const prettify = (name: string): string => {
  if (name === undefined) return name;
  var i,
    frags = name.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
};
