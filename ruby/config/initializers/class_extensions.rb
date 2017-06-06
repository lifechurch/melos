class String
  def to_bool
    return true if self == true || self =~ (/\A(true|t|yes|y|1)\Z/i)
    return false if self == false || self.blank? || self =~ (/\A(false|f|no|n|0)\Z/i)
    raise ArgumentError.new("invalid value for Boolean: \"#{self}\"")
  end
end

